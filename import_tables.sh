#!/bin/bash

DB_HOST="tramway.proxy.rlwy.net"
DB_PORT="50911"
DB_USER="root"
DB_PASS="KMWdTnuPrJbCJiCUAGukYPgtRXsBBzQP"
DB_NAME="railway"
MYSQL_CMD="mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS --protocol=TCP $DB_NAME"
LOG_FILE="import_tables_log.txt"
TABLES_DIR="tables_sql"

echo "==== Table import started at $(date) ====" > "$LOG_FILE"

for sqlfile in "$TABLES_DIR"/*.sql; do
    tablename=$(basename "$sqlfile" .sql)
    echo "[$(date)] Importing $tablename..." | tee -a "$LOG_FILE"
    if $MYSQL_CMD < "$sqlfile" 2>>"$LOG_FILE"; then
        echo "[$(date)] $tablename imported successfully." | tee -a "$LOG_FILE"
    else
        echo "[$(date)] ERROR importing $tablename!" | tee -a "$LOG_FILE"
    fi
done

echo "==== Table import finished at $(date) ====" >> "$LOG_FILE" 