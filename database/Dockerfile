FROM postgres:11-alpine

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_DB=api

RUN (crontab -u `whoami` -l ; echo "0 3 * * * /create-backup.sh") | crontab -u `whoami` -

COPY init-scripts/ /docker-entrypoint-initdb.d
COPY backup-scripts/ /

RUN chmod +x /create-backup.sh
RUN crond