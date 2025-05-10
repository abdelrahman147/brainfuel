#!/bin/bash

# --- CONFIGURATION ---
SQL_FILE="cleaned_gifts.sql"
DB_HOST="yamanote.proxy.rlwy.net"
DB_PORT="19511"
DB_USER="root"
DB_PASS="dJIixBObtuhUGEgmUzOUErlfTQbSPFrO"
DB_NAME="railway"
MYSQL_CMD="mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASS --protocol=TCP $DB_NAME"
LOG_FILE="import_log.txt"
# ---------------------

CURRENT_FILE="$SQL_FILE"
START_LINE=1
ATTEMPT=1

echo "==== Import started at $(date) ====" >> "$LOG_FILE"

while true; do
    echo "[$(date)] Attempt $ATTEMPT: Importing from line $START_LINE..." | tee -a "$LOG_FILE"
    ERROR_LINE=$($MYSQL_CMD < "$CURRENT_FILE" 2>&1 | tee -a "$LOG_FILE" | grep -oP "at line \\K[0-9]+")
    if [ -z "$ERROR_LINE" ]; then
        echo "[$(date)] Import completed successfully!" | tee -a "$LOG_FILE"
        break
    else
        echo "[$(date)] Lost connection at line $ERROR_LINE. Resuming..." | tee -a "$LOG_FILE"
        START_LINE=$ERROR_LINE
        sed -n "${START_LINE},\$p" "$SQL_FILE" > resume_tmp.sql
        CURRENT_FILE="resume_tmp.sql"
        ((ATTEMPT++))
    fi
done

# Clean up
rm -f resume_tmp.sql

echo "==== Import finished at $(date) ====" >> "$LOG_FILE" 