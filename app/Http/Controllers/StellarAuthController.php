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
     * Read env var from multiple sources; try alternate key if first is missing (Railway uses MYSQLHOST etc.).
     */
    private function getEnvVar(string $key, ?string $altKey = null): ?string
    {
        foreach (array_filter([$key, $altKey]) as $k) {
            $v = getenv($k);
            if ($v !== false && $v !== '') {
                return $v;
            }
            $v = $_ENV[$k] ?? null;
            if ($v !== null && $v !== '') {
                return $v;
            }
            $v = env($k);
            if ($v !== null && $v !== '') {
                return $v;
            }
        }
        return null;
    }

    /**
     * Use MySQL for auth (Railway). Set mysql config from DB_* or Railway's MYSQL* vars so host is not 127.0.0.1.
     */
    private function useMysqlForAuth(): void
    {
        Config::set('database.default', 'mysql');
        // Railway may expose MySQL as MYSQLHOST, MYSQLPORT, etc. when DB_* are not in process env
        $host = $this->getEnvVar('DB_HOST', 'MYSQLHOST') ?? config('database.connections.mysql.host');
        $port = $this->getEnvVar('DB_PORT', 'MYSQLPORT') ?? config('database.connections.mysql.port');
        $database = $this->getEnvVar('DB_DATABASE', 'MYSQLDATABASE') ?? config('database.connections.mysql.database');
        $username = $this->getEnvVar('DB_USERNAME', 'MYSQLUSER') ?? config('database.connections.mysql.username');
        $password = $this->getEnvVar('DB_PASSWORD', 'MYSQLPASSWORD');
        if ($password === null) {
            $password = config('database.connections.mysql.password');
        }
        if ($host) {
            Config::set('database.connections.mysql.host', $host);
            Config::set('database.connections.mysql.port', $port ?: '3306');
            Config::set('database.connections.mysql.database', $database ?: 'railway');
            Config::set('database.connections.mysql.username', $username ?: 'root');
            Config::set('database.connections.mysql.password', (string) $password);
            DB::purge('mysql');
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
            $msg = $e->getMessage();
            if (str_contains($msg, 'unable to open database file')) {
                return back()->withErrors([
                    'pin' => 'Database error. On Railway, set DB_CONNECTION=mysql and add MySQL variables (DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD), then redeploy.',
                ]);
            }
            // Show real DB error so we can fix it (e.g. connection refused, access denied, table not found)
            $short = str_contains($msg, 'SQLSTATE') ? (preg_match('/SQLSTATE\[[^\]]+\]\s*([^\n]+)/', $msg, $m) ? $m[1] : substr($msg, 0, 200)) : substr($msg, 0, 200);
            return back()->withErrors(['pin' => 'Database error: ' . $short]);
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
            $msg = $e->getMessage();
            if (str_contains($msg, 'unable to open database file')) {
                return back()->withErrors([
                    'pin' => 'Database error. On Railway, set DB_CONNECTION=mysql and add MySQL variables, then redeploy.',
                ]);
            }
            $short = str_contains($msg, 'SQLSTATE') ? (preg_match('/SQLSTATE\[[^\]]+\]\s*([^\n]+)/', $msg, $m) ? $m[1] : substr($msg, 0, 200)) : substr($msg, 0, 200);
            return back()->withErrors(['pin' => 'Database error: ' . $short]);
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
            $msg = $e->getMessage();
            if (str_contains($msg, 'unable to open database file')) {
                return back()->withErrors([
                    'pin' => 'Database error. On Railway, set DB_CONNECTION=mysql and add MySQL variables, then redeploy.',
                ]);
            }
            $short = str_contains($msg, 'SQLSTATE') ? (preg_match('/SQLSTATE\[[^\]]+\]\s*([^\n]+)/', $msg, $m) ? $m[1] : substr($msg, 0, 200)) : substr($msg, 0, 200);
            return back()->withErrors(['pin' => 'Database error: ' . $short]);
        }
    }
}
