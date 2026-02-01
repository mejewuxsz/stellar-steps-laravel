#!/bin/sh
# Start Laravel for Railway. Migrations run in releaseCommand; here we only serve.
set -e
php artisan config:clear 2>/dev/null || true
# Railway injects PORT (e.g. 8080). Fallback for local runs.
PORT="${PORT:-${RAILWAY_TCP_PROXY_PORT:-8000}}"
export PORT
echo "Listening on 0.0.0.0:$PORT"
exec php artisan serve --host=0.0.0.0 --port="$PORT"
