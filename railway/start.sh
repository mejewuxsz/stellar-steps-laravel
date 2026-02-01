#!/bin/sh
# Start Laravel for Railway. Clear any cached config so env vars (DB_CONNECTION, etc.) are read at runtime.
set -e
php artisan config:clear 2>/dev/null || true
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
