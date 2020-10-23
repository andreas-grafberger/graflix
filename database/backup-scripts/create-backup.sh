#!/bin/bash
mkdir -p /backups
pg_dump api -U me | openssl aes-256-cbc -a -salt -pass env:DB_DUMP_PW -out "/backups/db_$(date +%s).sql.enc"
