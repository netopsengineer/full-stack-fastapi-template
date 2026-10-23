#! /usr/bin/env bash

set -e
set -x

cd backend
uv run python -c "import app.main; import json; print(json.dumps(app.main.app.openapi()))" > ../openapi.json
cd ..
mv openapi.json frontend/
bun run --filter frontend generate-client
# Normalize generated whitespace without changing generated semantics.
find frontend/src/client -name '*.ts' -exec sed -i 's/[[:blank:]]*$//' {} +
bun run lint
