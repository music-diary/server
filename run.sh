#!/usr/bin/env sh
set -eu
cd /usr/src/app
npm ci
npm run db:generate
npm run build
exec npm run start:prod
