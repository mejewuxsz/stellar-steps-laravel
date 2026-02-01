<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StellarAuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/signup', function () {
    return Inertia::render('Signup');
})->name('signup');

Route::post('/signup/hero', [StellarAuthController::class, 'registerHero'])->name('signup.hero');
Route::post('/signup/guardian', [StellarAuthController::class, 'registerGuardian'])->name('signup.guardian');
Route::post('/login/stellar', [StellarAuthController::class, 'login'])->name('login.stellar');

Route::get('/mainplay', function () {
    return Inertia::render('Mainplay');
})->name('mainplay');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
