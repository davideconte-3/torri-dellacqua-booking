#!/bin/sh
# Installa traduzioni TastyIgniter (es. italiano) da uno zip scaricabile.
# Uso (dentro il container app, come root):
#   wget -qO- "URL_SCRIPT" | sh -s "URL_ZIP"
# oppure, con URL dello zip come primo argomento:
#   ./tastyigniter-install-lang.sh "https://transfer.sh/xxxxx/tastyigniter-it.zip"
#
# Per ottenere URL_ZIP: sul tuo PC carica il file con
#   curl --upload-file tastyigniter-it.zip https://transfer.sh/tastyigniter-it.zip

set -e
URL_ZIP="${1:?Usa: sh script.sh 'https://url-del-file.zip'}"

TI_ROOT="/home/www-user/site/tastyigniter"
TMP_DIR="/tmp/ti-lang-$$"

echo "Download da $URL_ZIP ..."
mkdir -p "$TMP_DIR"
if command -v wget >/dev/null 2>&1; then
  wget -q -O "$TMP_DIR/lang.zip" "$URL_ZIP"
elif command -v curl >/dev/null 2>&1; then
  curl -sL -o "$TMP_DIR/lang.zip" "$URL_ZIP"
else
  echo "Serve wget o curl nel container."
  exit 1
fi

echo "Estrazione ..."
cd "$TMP_DIR"
unzip -o -q lang.zip || true

echo "Copia in $TI_ROOT ..."
# v3: override lingue admin in language/<locale>/admin/lang.php (root app)
if [ -d "language" ]; then
  cp -Rn language "$TI_ROOT/" 2>/dev/null || cp -R language "$TI_ROOT/"
elif [ -f "it_IT/lang.php" ] || [ -f "it_IT/admin/lang.php" ]; then
  mkdir -p "$TI_ROOT/language/it_IT/admin"
  if [ -f "it_IT/admin/lang.php" ]; then
    cp -f it_IT/admin/lang.php "$TI_ROOT/language/it_IT/admin/"
  else
    cp -f it_IT/lang.php "$TI_ROOT/language/it_IT/admin/"
  fi
elif [ -d "it_IT" ]; then
  mkdir -p "$TI_ROOT/language/it_IT/admin"
  if [ -f "it_IT/lang.php" ]; then
    cp -f it_IT/lang.php "$TI_ROOT/language/it_IT/admin/"
  else
    cp -Rn it_IT "$TI_ROOT/language/" 2>/dev/null || cp -R it_IT "$TI_ROOT/language/"
  fi
elif [ -d "lang" ]; then
  cp -Rn lang "$TI_ROOT/" 2>/dev/null || cp -R lang "$TI_ROOT/"
else
  cp -Rn . "$TI_ROOT/" 2>/dev/null || cp -R . "$TI_ROOT/"
fi

echo "Permessi ..."
chown -R www-data:www-data "$TI_ROOT/language" 2>/dev/null || true
chown -R www-data:www-data "$TI_ROOT/lang" 2>/dev/null || true
chown -R www-data:www-data "$TI_ROOT/vendor/tastyigniter/flame/lang" 2>/dev/null || true

echo "Cache ..."
cd "$TI_ROOT" && php artisan cache:clear 2>/dev/null || true
cd "$TI_ROOT" && php artisan config:clear 2>/dev/null || true

rm -rf "$TMP_DIR"
echo "Fatto."
echo "v3 admin: le override devono stare in $TI_ROOT/language/it_IT/admin/lang.php"
echo "In admin: Admin (icona) > Edit Details > Languages -> seleziona Italiano (it_IT) e salva."
echo ""
