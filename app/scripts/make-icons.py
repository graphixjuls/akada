# Makes the akada app icons from the taped-glasses mark (Figma: Brand page, "0 · Final brand").
# Writes the Android, iOS, favicon and web (PWA) icons into assets/ and public/.
#   python scripts/make-icons.py
# The geometry matches src/components/Logo.tsx: a 96-unit grid, lenses r14 at (31, 50) and (65, 50).
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
BLUE = (0x15, 0x70, 0xE6, 255)
WHITE = (255, 255, 255, 255)
CLEAR = (0, 0, 0, 0)
SS = 4  # draw 4x larger, then scale down for smooth edges


def glasses(size, extent, fg=WHITE, bg=None, cut=BLUE, rounded=False):
    """The mark centred on a `size` canvas; the 96-unit grid fills `extent` of it."""
    big = size * SS
    img = Image.new('RGBA', (big, big), CLEAR)
    d = ImageDraw.Draw(img)
    if bg:
        if rounded:
            d.rounded_rectangle((0, 0, big - 1, big - 1), radius=big * 24 / 96, fill=bg)
        else:
            d.rectangle((0, 0, big, big), fill=bg)
    u = big * extent / 96              # one grid unit
    off = (big - 96 * u) / 2           # centre the grid
    p = lambda x, y: (off + x * u, off + y * u)

    def ring(cx, cy, r, w):
        x, y = p(cx, cy)
        d.ellipse((x - (r + w / 2) * u, y - (r + w / 2) * u, x + (r + w / 2) * u, y + (r + w / 2) * u), fill=fg)
        d.ellipse((x - (r - w / 2) * u, y - (r - w / 2) * u, x + (r - w / 2) * u, y + (r - w / 2) * u), fill=bg or CLEAR)

    def stroke(a, b, w, colour):
        d.line((p(*a), p(*b)), fill=colour, width=max(1, round(w * u)))
        for pt in (a, b):  # round caps
            x, y = p(*pt)
            d.ellipse((x - w / 2 * u, y - w / 2 * u, x + w / 2 * u, y + w / 2 * u), fill=colour)

    ring(31, 50, 14, 7)
    ring(65, 50, 14, 7)
    stroke((17, 45), (10, 40), 6, fg)
    stroke((79, 45), (86, 40), 6, fg)
    x0, y0 = p(42, 42); x1, y1 = p(54, 57)
    d.rounded_rectangle((x0, y0, x1, y1), radius=3 * u, fill=fg)
    stroke((45, 45), (45, 54), 2, cut)
    stroke((51, 45), (51, 54), 2, cut)
    return img.resize((size, size), Image.LANCZOS)


def save(img, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)
    print(path.relative_to(ROOT), img.size)


assets = ROOT / 'assets'
public = ROOT / 'public'

# App icon (iOS / store): full-bleed blue square; the system rounds the corners.
save(glasses(1024, 0.82, bg=BLUE).convert('RGB'), assets / 'icon.png')
# Android adaptive icon: the mark must sit inside the central safe zone (about 61% of the canvas).
save(glasses(512, 0.56), assets / 'android-icon-foreground.png')
save(Image.new('RGBA', (512, 512), BLUE), assets / 'android-icon-background.png')
save(glasses(432, 0.56, cut=CLEAR), assets / 'android-icon-monochrome.png')
# Splash: white glasses on the blue splash background.
save(glasses(256, 1.0), assets / 'splash-icon.png')
# Web: favicon, PWA icons (maskable keeps the mark inside the safe zone) and the iOS home-screen icon.
save(glasses(48, 0.9, bg=BLUE, rounded=True), assets / 'favicon.png')
save(glasses(192, 0.82, bg=BLUE), public / 'icons' / 'icon-192.png')
save(glasses(512, 0.82, bg=BLUE), public / 'icons' / 'icon-512.png')
save(glasses(512, 0.6, bg=BLUE), public / 'icons' / 'maskable-512.png')
save(glasses(180, 0.82, bg=BLUE).convert('RGB'), public / 'icons' / 'apple-touch-icon.png')
