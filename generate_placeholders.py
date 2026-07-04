from PIL import Image, ImageDraw, ImageFont
import os

files = {
    'assets/img/hero-excavator-sunset.jpg': (1600, 900, '#2b2b2b'),
    'assets/img/about-site-overview.jpg': (1200, 800, '#1f4a78'),
    'assets/img/crane-tower-site.jpg': (1200, 800, '#6b3a1a'),
    'assets/img/excavator-loading-truck.jpg': (1200, 800, '#3b5f2d'),
    'assets/img/excavator-arm-closeup.jpg': (1200, 800, '#5a3c6f'),
    'assets/img/loader-site.jpg': (1200, 800, '#424242'),
    'assets/img/welding-sparks.jpg': (1200, 800, '#b03a17'),
    'assets/img/crane-loading-truck.jpg': (1200, 800, '#2a4f6f'),
    'assets/img/excavator-square.jpg': (1200, 800, '#2f3f58'),
    'assets/img/logo-horizontal-gold.png': (600, 200, '#111111'),
}

font = ImageFont.load_default()
for path, (width, height, bg) in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image = Image.new('RGB', (width, height), bg)
    draw = ImageDraw.Draw(image)

    text1 = 'Placeholder'
    text2 = os.path.basename(path)

    w1, h1 = draw.textsize(text1, font=font)
    w2, h2 = draw.textsize(text2, font=font)

    draw.text(((width - w1) / 2, (height - h1) / 2 - 20), text1, fill='white', font=font)
    draw.text(((width - w2) / 2, (height - h2) / 2 + 20), text2, fill='white', font=font)

    fmt = 'PNG' if path.lower().endswith('.png') else 'JPEG'
    image.save(path, fmt, quality=85)

print(f'Generated {len(files)} placeholder images.')
