#!/usr/bin/env bash

set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
herd_mcp_phar="${HERD_MCP_PHAR:-/Applications/Herd.app/Contents/Resources/herd-mcp.phar}"

if [[ ! -f "$herd_mcp_phar" ]]; then
    printf 'Herd MCP executable not found at %s. Set HERD_MCP_PHAR to its location.\n' "$herd_mcp_phar" >&2
    exit 1
fi

SITE_PATH="$project_root" exec php "$herd_mcp_phar"
