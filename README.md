# Live

Live is a donation and streaming-alert platform built as a clone of [Pix.gg](https://pix.gg/) and [LivePix](https://livepix.gg/). Streamers can receive donations, manage donation alerts and goals, and share widgets for use with streaming software such as OBS.

The app is built with Laravel 13, PHP 8.5, Inertia, React, TypeScript, and Bun. PostgreSQL stores application data, Redis powers queues, cache, and sessions, and Laravel Reverb delivers real-time events.

## Requirements

- PHP 8.5 with the extensions required by Laravel and OpenSSL
- Composer
- Bun 1.4.4 or newer
- PostgreSQL
- Redis
- Yerd for local PHP, HTTPS, and Redis services
- FFmpeg and FFprobe for validating uploaded audio

## Local setup

1. Clone the repository and open its root directory.
2. Install dependencies and create your local environment file:

   ```sh
   composer install
   bun install
   cp .env.example .env
   php artisan key:generate
   ```

3. In Yerd, link the project as `live.test`, use `public/` as its document root, select PHP 8.5, and enable HTTPS. Start Yerd's PostgreSQL and Redis services.
4. Create a PostgreSQL database and user, then set `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in `.env` to match. The example file uses `live` for both the database and username, with `127.0.0.1:5432` as the database address.
5. Confirm `.env` uses Redis for the cache and queue (`CACHE_STORE=redis`, `QUEUE_CONNECTION=redis`) and points Redis to `127.0.0.1:6379`.
6. Keep the Reverb values from `.env.example` for local development. They configure Reverb to listen over HTTP on port `8081` while the browser connects securely through `https://live.test/app`. In Yerd, add the `/app` proxy to `http://127.0.0.1:8081` and secure the site:

   ```sh
   yerd proxy add live /app http://127.0.0.1:8081
   yerd secure live
   ```

   Check the Yerd site and service status before starting the app:

   ```sh
   yerd sites
   yerd services
   yerd status
   ```
7. Run database migrations and link public storage:

   ```sh
   php artisan migrate
   php artisan storage:link
   ```

8. Start the development processes:

   ```sh
   composer dev
   ```

   This starts Laravel, the queue listener for `default`, `alert`, and `audio-processing`, Pail logs, Reverb, and the Vite development server. Open [https://live.test](https://live.test).

The `.env.example` file contains local defaults for PostgreSQL, Redis, Reverb, and Vite. Keep secrets and machine-specific values in `.env`; never commit that file.

## Useful commands

```sh
# Build the client and server-rendered bundles
bun run build

# Check TypeScript
bun run types

# Format and lint JavaScript and TypeScript
bun run format
bun run lint

# Run the PHP test suite in parallel
composer test

# Run PHPStan
composer analyse
```

## Configuration

- **Payment processors:** configure provider credentials in the authenticated settings area. Efi Bank requires its API credentials and `.p12` certificate.
- **File storage:** local storage is the default. Cloudflare R2 settings are available in `.env.example` for deployments that need object storage.
- **Mail:** local mail defaults to Laravel's log driver. Configure a mail provider in `.env` when testing email delivery.

## Project notes

- The default database seeder is empty; create an account through the registration page after migrating.
- Queue-backed work requires Redis and the queue listener started by `composer dev`.
- Real-time donation alerts require Reverb and the Yerd `/app` HTTPS proxy described above.
