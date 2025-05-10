#!/bin/bash
# Script to split cleaned_gifts.sql into per-table SQL files

INPUT_FILE="cleaned_gifts.sql"
OUTPUT_DIR="tables_sql"

mkdir -p "$OUTPUT_DIR"

awk '
  /^DROP TABLE IF EXISTS/ {
    if (out) close(out)
    match($0, /`([^`]*)`/, arr)
    out = "
</rewritten_file> 