#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Package committed Node.js application sources, without local configuration.
# Deployment and runtime settings must be supplied through Elastic Beanstalk.
output="${1:-deploy.zip}"
if [ -e "$output" ]; then
  printf 'Output already exists: %s\nChoose a new output path.\n' "$output" >&2
  exit 1
fi

git archive --format=zip --output="$output" HEAD \
  src package.json package-lock.json nest-cli.json \
  tsconfig.json tsconfig.build.json Procfile
printf 'Created %s from committed HEAD. No upload was performed.\n' "$output"
