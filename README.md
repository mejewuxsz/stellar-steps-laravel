<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## Stellar Steps (Laravel + Inertia React)

This folder is the **Option B** stack for Stellar Steps: **Laravel (backend) + Inertia (React) + Tailwind (frontend)**.

### Run locally (XAMPP-friendly)

From `c:\xampp\htdocs\project-stellar-steps\stellar-steps-laravel`:

- Install dependencies (already done by the scaffold, rerun if needed):
  - `composer install`
  - `npm install`
- Start the dev servers:
  - `php artisan serve`
  - `npm run dev`

Then open the URL shown by `php artisan serve` (usually `http://127.0.0.1:8000`).

### Using MySQL (recommended with XAMPP)

By default, this scaffold may use SQLite for convenience. For XAMPP MySQL, update your `.env`:

- `DB_CONNECTION=mysql`
- `DB_HOST=127.0.0.1`
- `DB_PORT=3306`
- `DB_DATABASE=stellar_steps`
- `DB_USERNAME=root`
- `DB_PASSWORD=`

Then run:

- `php artisan migrate`

### Deploy on Railway

The app is set up for [Railway](https://railway.app) with a Dockerfile and `railway.toml`.

1. **Create a project** at [railway.com/new](https://railway.com/new) and choose **Deploy from GitHub repo**. Select this repo.
2. **Set Root Directory** (in the service **Settings** → **Source**) to `stellar-steps-laravel` so Railway builds from the Laravel app folder.
3. **Add a MySQL database**: In the project, click **+ New** → **Database** → **MySQL**. Railway will set `MYSQL_URL` (or similar); you’ll map it to Laravel’s `DB_*` variables.
4. **Variables** (Settings → Variables). Add at least:
   - `APP_KEY` — from `php artisan key:generate --show` (run locally).
   - `APP_ENV` — `production`
   - `APP_DEBUG` — `false`
   - `APP_URL` — your Railway URL (e.g. `https://your-app.up.railway.app`) after you generate a domain.
   - **Database**: set `DB_CONNECTION=mysql` and either
     - `DB_URL=${{MySQL.MYSQL_URL}}` (reference your MySQL service name), or
     - `DB_HOST=${{MySQL.MYSQLHOST}}`, `DB_PORT=${{MySQL.MYSQLPORT}}`, `DB_DATABASE=${{MySQL.MYSQLDATABASE}}`, `DB_USERNAME=${{MySQL.MYSQLUSER}}`, `DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}`.
   - **Logging** (recommended on Railway):
     - `LOG_CHANNEL=stderr`
     - `LOG_STDERR_FORMATTER=\Monolog\Formatter\JsonFormatter`
5. **Generate a domain**: Settings → **Networking** → **Generate Domain**.
6. **Redeploy** so `APP_URL` and DB are correct.

Migrations run automatically before each deploy via `railway.toml` `releaseCommand`. For queue workers or cron, add separate services and use the scripts in `railway/` (e.g. `railway/init-app.sh`).

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
