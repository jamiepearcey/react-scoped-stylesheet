#!/bin/bash
set -e

rustup target add wasm32-unknown-unknown

cargo build --target wasm32-unknown-unknown --release

mkdir -p dist

cp ../../target/wasm32-unknown-unknown/release/next_swc_tagging.wasm dist/plugin.wasm

echo "Build complete! WASM file is at dist/plugin.wasm"
