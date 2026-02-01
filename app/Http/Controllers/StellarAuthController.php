<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StellarAuthController extends Controller
{
    /**
     * Force default DB to MySQL when MySQL env vars are present (Railway). Stops cached config from using SQLite.
     */
    private function useMysqlIfConfigured(): void
    {
        if (env('DB_HOST')) {
            Config::set('database.default', 'mysql');
        }
    }

    /**
     * Ensure users table has Hero/Guardian columns (migrations have run).
     * Use mysql connection explicitly when DB_HOST is set (Railway) so we never touch SQLite.
     */
    private function ensureStellarMigrationsRan(): ?\Illuminate\Http\RedirectResponse
    {
        $connection = env('DB_HOST') ? 'mysql' : config('database.default');
        if (! Schema::connection($connection)->hasColumn('users', 'role')) {
            return back()->withErrors([
                'pin' => 'Database setup is incomplete. Please redeploy the app on Railway so migrations run (Settings → Redeploy), or run: php artisan migrate',
            ]);
        }
        return null;
    }

    /**
     * Register a Hero (name, age, 4-digit PIN). Generates hero_code for guardian linking.
     */
    public function registerHero(Request $request)
    {
        $this->useMysqlIfConfigured();
        if ($redirect = $this->ensureStellarMigrationsRan()) {
            return $redirect;
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|string|max:50',
            'pin' => 'required|string|size:4|regex:/^[0-9]{4}$/',
        ]);

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
    }

    /**
     * Register a Guardian (name, hero_code, 4-digit PIN). Links to existing hero by hero_code.
     */
    public function registerGuardian(Request $request)
    {
        $this->useMysqlIfConfigured();
        if ($redirect = $this->ensureStellarMigrationsRan()) {
            return $redirect;
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'hero_code' => 'required|string|max:20',
            'pin' => 'required|string|size:4|regex:/^[0-9]{4}$/',
        ]);

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
    }

    /**
     * Log in by name + PIN + role (hero or guardian).
     */
    public function login(Request $request)
    {
        $this->useMysqlIfConfigured();
        if ($redirect = $this->ensureStellarMigrationsRan()) {
            return $redirect;
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'pin' => 'required|string|size:4|regex:/^[0-9]{4}$/',
            'role' => 'required|in:hero,guardian',
        ]);

        $user = User::where('role', $request->role)->where('name', $request->name)->first();

        if (!$user || !Hash::check($request->pin, $user->password)) {
            return back()->withErrors(['pin' => 'Name and PIN do not match.']);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('mainplay');
    }
}
