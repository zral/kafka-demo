#!/usr/bin/env bash
# Generates a markdown table listing kafka-demo images and sizes
set -euo pipefail
echo "| Service | Image Tag | Size |"
echo "|---|---:|---:|"

docker images --format '{{.Repository}}|{{.Tag}}|{{.Size}}' | grep kafka-demo- | sort | while IFS='|' read -r repo tag size; do
  name=${repo#kafka-demo-}
  printf "| %s | %s | %s |\n" "$name" "$tag" "$size"
done
