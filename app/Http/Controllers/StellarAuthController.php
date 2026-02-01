<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StellarAuthController extends Controller
{
    /**
     * Use MySQL for auth (Railway). Set default and mysql config from process env so it works even when config is cached.
     */
    private function useMysqlForAuth(): void
    {
        Config::set('database.default', 'mysql');
        // Read from getenv() so Railway vars are used even if Laravel config was cached (env() disabled)
        $host = getenv('DB_HOST') ?: config('database.connections.mysql.host');
        $port = getenv('DB_PORT') ?: config('database.connections.mysql.port');
        $database = getenv('DB_DATABASE') ?: config('database.connections.mysql.database');
        $username = getenv('DB_USERNAME') ?: config('database.connections.mysql.username');
        $password = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : config('database.connections.mysql.password');
        if ($host) {
            Config::set('database.connections.mysql.host', $host);
            Config::set('database.connections.mysql.port', $port ?: '3306');
            Config::set('database.connections.mysql.database', $database ?: 'railway');
            Config::set('database.connections.mysql.username', $username ?: 'root');
            Config::set('database.connections.mysql.password', (string) $password);
            DB::purge('mysql'); // force reconnect with new config
        }
    }

    /**
     * Register a Hero (name, age, 4-digit PIN). Generates hero_code for guardian linking.
     */
    public function registerHero(Request $request)
    {
        $this->useMysqlForAuth();

        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|string|max:50',
            'pin' => 'required|string|size:4|regex:/^[0-9]{4}$/',
        ]);

        try {
            $existing = User::where('role', 'hero')->where('name', $request->name)->first();
            if ($existing) {
                return back()->withErrors(['name' => 'A hero with this name already exists.']);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => 'hero.' . Str::random(20) . '@stellar.local',
                'password' => Hash::make($request->pin),
                'role' => 'hero',
                'age' => $request->age,
                'hero_code' => User::generateHeroCode(),
            ]);

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->route('mainplay');
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'unable to open database file') || str_contains($e->getMessage(), 'SQLSTATE')) {
                return back()->withErrors([
                    'pin' => 'Database error. On Railway, set DB_CONNECTION=mysql and add MySQL variables (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD), then redeploy.',
                ]);
            }
            throw $e;
        }
    }

    /**
     * Register a Guardian (name, hero_code, 4-digit PIN). Links to existing hero by hero_code.
     */
    public function registerGuardian(Request $request)
    {
        $this->useMysqlForAuth();

        $request->validate([
            'name' => 'required|string|max:255',
            'hero_code' => 'required|string|max:20',
            'pin' => 'required|string|size:4|regex:/^[0-9]{4}$/',
        ]);

        try {
            $hero = User::where('role', 'hero')->where('hero_code', $request->hero_code)->first();
            if (!$hero) {
                return back()->withErrors(['hero_code' => 'No hero found with this Hero Code.']);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => 'guardian.' . Str::random(20) . '@stellar.local',
                'password' => Hash::make($request->pin),
                'role' => 'guardian',
                'age' => null,
                'hero_code' => null,
            ]);

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->route('mainplay');
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'unable to open database file') || str_contains($e->getMessage(), 'SQLSTATE')) {
                return back()->withErrors([
                    'pin' => 'Database error. On Railway, set DB_CONNECTION=mysql and add MySQL variables, then redeploy.',
                ]);
            }
            throw $e;
        }
    }

    /**
     * Log in by name + PIN + role (hero or guardian).
     */
    public function login(Request $request)
    {
        $this->useMysqlForAuth();

        $request->validate([
            'name' => 'required|string|max:255',
            'pin' => 'required|string|size:4|regex:/^[0-9]{4}$/',
            'role' => 'required|in:hero,guardian',
        ]);

        try {
            $user = User::where('role', $request->role)->where('name', $request->name)->first();

            if (!$user || !Hash::check($request->pin, $user->password)) {
                return back()->withErrors(['pin' => 'Name and PIN do not match.']);
            }

            Auth::login($user);
            $request->session()->regenerate();

            return redirect()->route('mainplay');
        } catch (\Throwable $e) {
            if (str_contains($e->getMessage(), 'unable to open database file') || str_contains($e->getMessage(), 'SQLSTATE')) {
                return back()->withErrors([
                    'pin' => 'Database error. On Railway, set DB_CONNECTION=mysql and add MySQL variables, then redeploy.',
                ]);
            }
            throw $e;
        }
    }
}
