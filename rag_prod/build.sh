#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install --upgrade pip

# Install CPU-only PyTorch first (no CUDA — Render has no GPU)
pip install torch --index-url https://download.pytorch.org/whl/cpu

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
