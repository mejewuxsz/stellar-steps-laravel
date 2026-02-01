#!/bin/sh
# Start Laravel for Railway. Run migrations then serve (so tables exist even if release phase didn't run).
set -e
php artisan config:clear 2>/dev/null || true
php artisan migrate --force 2>/dev/null || true
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
