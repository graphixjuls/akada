# Makes the temporary Akada app icons (a white "A" on Akada blue) until the real logo is supplied.
# Writes the Android, iOS, favicon and web (PWA) icons into assets/ and public/.
#   python scripts/make-icons.py
# When the logo arrives, replace this with icons made from the logo (same file names and sizes).
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / 'node_modules/@expo-google-fonts/plus-jakarta-sans/800ExtraBold/PlusJakartaSans_800ExtraBold.ttf'
BLUE = (0x15, 0x70, 0xE6, 255)
WHITE = (255, 255, 255, 255)


def letter(size, scale, colour=WHITE, background=None):
    """A centred "A" whose cap height is `scale` of the canvas."""
    img = Image.new('RGBA', (size, size), background or (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(str(FONT), int(size * scale * 1.38))
    left, top, right, bottom = draw.textbbox((0, 0), 'A', font=font)
    x = (size - (right - left)) / 2 - left
    y = (size - (bottom - top)) / 2 - top
    draw.text((x, y), 'A', font=font, fill=colour)
    return img


def save(img, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)
    print(path.relative_to(ROOT), img.size)


assets = ROOT / 'assets'
public = ROOT / 'public'

# App icon (iOS / store): full-bleed blue square; the system rounds the corners.
save(letter(1024, 0.46, background=BLUE).convert('RGB'), assets / 'icon.png')
# Android adaptive icon: the letter must sit inside the central safe zone (about 61% of the canvas).
save(letter(512, 0.30), assets / 'android-icon-foreground.png')
save(Image.new('RGBA', (512, 512), BLUE), assets / 'android-icon-background.png')
save(letter(432, 0.30), assets / 'android-icon-monochrome.png')
# Splash: the letter alone, shown on the blue splash background.
save(letter(256, 0.62), assets / 'splash-icon.png')
# Web: favicon, PWA icons (maskable keeps the letter inside the safe zone) and the iOS home-screen icon.
save(letter(48, 0.5, background=BLUE), assets / 'favicon.png')
save(letter(192, 0.46, background=BLUE), public / 'icons' / 'icon-192.png')
save(letter(512, 0.46, background=BLUE), public / 'icons' / 'icon-512.png')
save(letter(512, 0.34, background=BLUE), public / 'icons' / 'maskable-512.png')
save(letter(180, 0.46, background=BLUE).convert('RGB'), public / 'icons' / 'apple-touch-icon.png')
