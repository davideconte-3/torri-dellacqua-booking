#!/bin/sh
# Copia lang.php da /tmp/ nella posizione corretta per le traduzioni admin (v3).
# Uso (nel container, con il file già in /tmp):
#   sh tastyigniter-apply-lang-from-tmp.sh
#   sh tastyigniter-apply-lang-from-tmp.sh /tmp/mio-lang.php
#   TI_ROOT=/var/www/html sh tastyigniter-apply-lang-from-tmp.sh /tmp/lang.php
#
# Prima di eseguire: copia il file nel container, es.:
#   docker cp lang.php CONTAINER:/tmp/lang.php

set -e

TI_ROOT="${TI_ROOT:-/home/www-user/site/tastyigniter}"
SRC="${1:-/tmp/lang.php}"
DEST_DIR="$TI_ROOT/language/it_IT/admin"
DEST="$DEST_DIR/lang.php"

if [ ! -f "$SRC" ]; then
  echo "File non trovato: $SRC"
  echo "Uso: $0 [path/file.php]   (default: /tmp/lang.php)"
  exit 1
fi

echo "Copia $SRC -> $DEST"
mkdir -p "$DEST_DIR"
cp -f "$SRC" "$DEST"

echo "Permessi..."
chown -R www-data:www-data "$TI_ROOT/language" 2>/dev/null || true

echo "Cache..."
cd "$TI_ROOT" && php artisan cache:clear 2>/dev/null || true
cd "$TI_ROOT" && php artisan config:clear 2>/dev/null || true

echo "Fatto. In admin: Admin > Edit Details > Languages -> Italiano (it_IT)."
