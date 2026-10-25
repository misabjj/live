#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 3 ]]; then
    printf 'Usage: %s <private-key.pem> <certificate.pem> <output.p12>\n' "$0" >&2
    exit 1
fi

private_key="$1"
certificate="$2"
output="$3"

if [[ ! -f "$private_key" || ! -f "$certificate" ]]; then
    printf 'Private key and certificate files are required.\n' >&2
    exit 1
fi

mkdir -p "$(dirname "$output")"

openssl pkcs12 -export \
    -inkey "$private_key" \
    -in "$certificate" \
    -out "$output" \
    -passout pass:

chmod 600 "$output"

openssl pkcs12 -in "$output" -info -noout -passin pass: >/dev/null
printf 'Created passwordless EFI PKCS#12 certificate: %s\n' "$output"
