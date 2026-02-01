#!/bin/sh
# Start Laravel for Railway. Do not cache config so DB_CONNECTION and env vars are read at runtime.
set -e
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
