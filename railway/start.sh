#!/bin/sh
# Start Laravel for Railway: cache config if DB is available, then serve.
# If config:cache fails (e.g. DB not ready), we still start so the app responds.
set -e
php artisan config:cache 2>/dev/null || true
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
