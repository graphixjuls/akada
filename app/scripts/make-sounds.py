"""Generates akada's UI sounds (original, synthesised; no samples). Run: python scripts/make-sounds.py"""
import math, struct, wave, os

RATE = 22050
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'sounds')

def note(freq, dur, vol, attack=0.006, decay=6.0, shape='sine'):
    n = int(RATE * dur)
    out = []
    for i in range(n):
        t = i / RATE
        env = min(1.0, t / attack) * math.exp(-decay * t)
        ph = 2 * math.pi * freq * t
        if shape == 'sine':
            s = math.sin(ph) + 0.25 * math.sin(2 * ph)
        else:  # soft triangle
            s = 2 / math.pi * math.asin(math.sin(ph))
        out.append(s * env * vol)
    return out

def mix(parts, total):
    buf = [0.0] * int(RATE * total)
    for start, samples in parts:
        o = int(RATE * start)
        for i, s in enumerate(samples):
            if o + i < len(buf):
                buf[o + i] += s
    return buf

def write(name, buf):
    peak = max(abs(s) for s in buf) or 1
    gain = min(1.0, 0.9 / peak)
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s * gain)) * 32767 * 0.5)) for s in buf))

# Correct: two rising notes (E6 → A6), bright and short.
write('correct.wav', mix([(0.0, note(1318.5, 0.22, 0.5, decay=14)), (0.07, note(1760.0, 0.3, 0.5, decay=11))], 0.38))
# Wrong: a soft, low two-note fall (A3 → F3). Gentle, never harsh.
write('wrong.wav', mix([(0.0, note(220.0, 0.2, 0.6, decay=12, shape='tri')), (0.09, note(174.6, 0.26, 0.6, decay=10, shape='tri'))], 0.36))
# Session complete: a small rising arpeggio (C6 E6 G6 C7).
write('complete.wav', mix([(0.0, note(1046.5, 0.3, 0.45, decay=8)), (0.09, note(1318.5, 0.3, 0.45, decay=8)), (0.18, note(1568.0, 0.32, 0.45, decay=7)), (0.27, note(2093.0, 0.45, 0.4, decay=6))], 0.75))
print('ok')
