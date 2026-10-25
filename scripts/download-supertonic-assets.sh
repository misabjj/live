#!/usr/bin/env bash

set -euo pipefail

base_url="${SUPERTONIC_MODEL_BASE_URL:-https://huggingface.co/Supertone/supertonic-3/resolve/main}"
target_dir="${SUPERTONIC_ASSET_DIR:-public/supertonic}"
ort_source_dir="node_modules/onnxruntime-web/dist"

ort_files=(
    ort-wasm-simd-threaded.asyncify.mjs
    ort-wasm-simd-threaded.asyncify.wasm
    ort-wasm-simd-threaded.jsep.mjs
    ort-wasm-simd-threaded.jsep.wasm
    ort-wasm-simd-threaded.mjs
    ort-wasm-simd-threaded.wasm
)

for file in "${ort_files[@]}"; do
    source_file="${ort_source_dir}/${file}"
    destination="${target_dir}/ort/${file}"

    if [[ ! -s "${source_file}" ]]; then
        echo "Missing ${source_file}; run npm install before downloading Supertonic assets." >&2
        exit 1
    fi

    mkdir -p "$(dirname "${destination}")"
    cp "${source_file}" "${destination}"
done

files=(
    LICENSE
    onnx/duration_predictor.onnx
    onnx/text_encoder.onnx
    onnx/tts.json
    onnx/unicode_indexer.json
    onnx/vector_estimator.onnx
    onnx/vocoder.onnx
    voice_styles/F1.json
    voice_styles/F2.json
    voice_styles/F3.json
    voice_styles/F4.json
    voice_styles/F5.json
    voice_styles/M1.json
    voice_styles/M2.json
    voice_styles/M3.json
    voice_styles/M4.json
    voice_styles/M5.json
)

for file in "${files[@]}"; do
    destination="${target_dir}/${file}"

    if [[ -s "${destination}" ]]; then
        echo "Already present: ${destination}"
        continue
    fi

    mkdir -p "$(dirname "${destination}")"
    temporary_file="${destination}.download"

    echo "Downloading ${file}"
    curl --fail --location --retry 3 --output "${temporary_file}" "${base_url}/${file}?download=true"
    mv "${temporary_file}" "${destination}"
done

echo "Supertonic browser assets are ready in ${target_dir}."
