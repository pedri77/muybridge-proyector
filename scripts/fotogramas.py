"""Prepara los fotogramas de la web en public/img/ a partir de las miniaturas de Commons (datos-crudos/img).

- sallie/01..12: los 12 cuadros de la tarjeta The Horse in Motion (19-06-1878), cortados por su rejilla.
- annie/00..14: lámina 626 de Animal Locomotion (1887), yegua Annie G. al galope (animación de Commons).
- disco/<animal>/00..: dibujos de los discos del zoopraxiscopio (Descriptive Zoopraxography, 1893).
- laminas/: láminas de animales de Animal Locomotion y el Derby de Epsom de Géricault (1821).
"""
import json
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIG = RAIZ / "datos-crudos" / "img"
DEST = RAIZ / "public" / "img"


def guarda(im: Image.Image, ruta: Path, ancho: int | None = None, q: int = 80) -> tuple[int, int]:
    ruta.parent.mkdir(parents=True, exist_ok=True)
    im = im.convert("L").convert("RGB") if im.mode not in ("RGB", "L") else im.convert("RGB")
    if ancho and im.width > ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    im.save(ruta, "WEBP", quality=q, method=6)
    return im.size


def frames(gif: Path):
    im = Image.open(gif)
    for i in range(im.n_frames):
        im.seek(i)
        yield im.convert("RGB")


datos: dict = {}

# 1. Sallie Gardner: rejilla 4 x 3 detectada sobre la miniatura de 1920 px.
card = Image.open(ORIG / "horse1920.jpg")
xs = [(46, 486), (505, 947), (964, 1406), (1425, 1868)]
ys = [(49, 332), (348, 633), (649, 934)]
n = 0
for y0, y1 in ys:
    for x0, x1 in xs:
        n += 1
        w, h = guarda(card.crop((x0 + 3, y0 + 3, x1 - 3, y1 - 3)), DEST / "sallie" / f"{n:02d}.webp", q=82)
datos["sallie"] = {"n": n, "w": w, "h": h}
guarda(card, DEST / "sallie" / "tarjeta.webp", 1400, 78)
datos["tarjeta"] = dict(zip(("w", "h"), Image.open(DEST / "sallie" / "tarjeta.webp").size))

# 2. Annie G. (lámina 626).
fs = list(frames(ORIG / "Muybridge race horse animated.gif"))
for i, f in enumerate(fs):
    w, h = guarda(f, DEST / "annie" / f"{i:02d}.webp", q=82)
datos["annie"] = {"n": len(fs), "w": w, "h": h}

# 3. Discos del zoopraxiscopio (Descriptive Zoopraxography, 1893), recortados en cuadrado sobre su centro.
#    Centro y radio ajustados por mínimos cuadrados sobre el borde del disco (miniatura de 960 px).
#    «pasos»: el disco avanza 1/pasos de vuelta por fotograma (lo que usan las animaciones de Commons).
DISCOS = {"galgo": ("Greyhound Galloping", 480.3, 484.1, 458.2, 13), "bisonte": ("Buffalo Galloping", 480.9, 487.3, 447.6, 13),
          "alce": ("Elk Galloping", 479.3, 489.9, 451.6, 13), "leon": ("Lion Walking", 479.6, 481.2, 448.7, 13),
          "elefante": ("Elephant Ambling", 482.0, 484.9, 451.0, 12), "palomas": ("Pigeons Flying", 480.0, 483.3, 458.0, 12)}
datos["discos"] = {}
for k, (nombre, cx, cy, r, pasos) in DISCOS.items():
    im = Image.open(ORIG / f"Descriptive Zoopraxography {nombre}.jpg")
    m = r * 1.025
    caja = (round(cx - m), round(cy - m), round(cx + m), round(cy + m))
    w, h = guarda(im.crop(caja).resize((900, 900), Image.LANCZOS), DEST / "disco" / f"{k}.webp", q=80)
    datos["discos"][k] = {"pasos": pasos, "w": w, "h": h, "fichero": f"Descriptive Zoopraxography {nombre}.jpg"}

# 4. Láminas y cuadro.
LAMINAS = {"l563": "Animal locomotion. Plate 563 (Boston Public Library).jpg", "l709": "Animal locomotion. Plate 709 (Boston Public Library).jpg",
           "l686": "Eadweard Muybridge - Animal Locomotion, Plate 686 - Google Art Project.jpg",
           "l712": "Eadweard Muybridge - Animal Locomotion, Plate 712 - Google Art Project.jpg",
           "derby": "Le Derby de 1821 à Epsom - Théodore Géricault - Musée du Louvre Peintures MI 708.jpg"}
datos["laminas"] = {}
for k, f in LAMINAS.items():
    w, h = guarda(Image.open(ORIG / f), DEST / "laminas" / f"{k}.webp", 960, 80)
    datos["laminas"][k] = {"w": w, "h": h, "fichero": f}

(RAIZ / "src" / "datos" / "imagenes.json").write_text(json.dumps(datos, ensure_ascii=False, indent=1))
print(json.dumps(datos, ensure_ascii=False)[:600])
