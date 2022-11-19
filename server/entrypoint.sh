#!/usr/bin/env sh
set -e

MYCLI="mycli --password password mysql://root@db:3306"

# Wait for database docker to be ready
echo "Waiting for DB to be ready"
until $MYCLI -e 'SHOW DATABASES' 2>&1 >/dev/null; do
    echo "Polling DB..."
    sleep 1
done
echo "DB is ready"

# Migrate database

# Change test database host in configuration
tmp=$(mktemp)
jq '.test.database.connection.host = "db" | .database.connection.host = "db"' \
    config/local.json > $tmp
mv $tmp config/local.json

# needed by fetchTreePermit()
mkdir -p $(jq -r .trees.rawDataDir config/local.json)
echo "Migrating DB..."
yarn run knex migrate:latest
echo "Done migrating DB"

# Run application
echo "Starting application"
yarn start
echo "Application exited"
