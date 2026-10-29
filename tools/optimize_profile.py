#!/usr/bin/env python3
"""Optimiza una imagen de perfil cuadrada para el blog sin modificar el original."""
from pathlib import Path
from PIL import Image
import sys

source = Path(sys.argv[1])
destination = Path(sys.argv[2] if len(sys.argv) > 2 else "public/profile.jpg")
destination.parent.mkdir(parents=True, exist_ok=True)
with Image.open(source) as image:
    image = image.convert("RGB")
    width, height = image.size
    side = min(width, height)
    left = (width - side) // 2
    top = max(0, min(height - side, int(height * 0.04)))
    image = image.crop((left, top, left + side, top + side))
    image = image.resize((480, 480), Image.Resampling.LANCZOS)
    image.save(destination, "JPEG", quality=78, optimize=True, progressive=True)
print(f"Imagen optimizada: {destination}")
