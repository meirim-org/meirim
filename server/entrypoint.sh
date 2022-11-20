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
jq_filter=$(cat  << EOF
    .database.connection.host = \$database_host
    | .email.options.auth.pass = "pass"
    | .email.options.auth.templatePass = "pass"
    | .email.options.auth.user = "user"
    | .email.options.host = \$smtp_host
    | .email.options.port = \$smtp_port
    | .email.options.secure = false
    | .general.domain = "http://localhost:3000/"
    | .test.database.connection.host = \$database_host
    | .test.email.options.host = \$smtp_host
    | .test.email.options.port = \$smtp_port
    | .test.email.options.secure = false
EOF
); jq_filter=${jq_filter%a}
tmp=$(mktemp)
jq \
    --arg database_host db \
    --arg smtp_host mailhog \
    --arg smtp_port 1025 \
    "$jq_filter" \
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
