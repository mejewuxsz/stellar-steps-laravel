#!/bin/sh
# Start Laravel for Railway. Run migrations (with timeout so we don't hang) then serve.
set -e
php artisan config:clear 2>/dev/null || true
# Run migrate with 60s timeout so DB connection issues don't block the app from starting (502)
timeout 60 php artisan migrate --force 2>/dev/null || true
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
