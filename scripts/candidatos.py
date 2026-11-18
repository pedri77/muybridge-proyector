"""Candidatos curados: licencia, tamaño y fotogramas. Descarga miniaturas estándar (500 px) a datos-crudos/."""
import sys, time, urllib.request
from pathlib import Path
from PIL import Image
sys.path.insert(0, str(Path(__file__).parent))
from comun import RAIZ, UA, info, buscar

LISTA = [
    "Muybridge race horse animated.gif", "The Horse in Motion high res.jpg",
    "Descriptive Zoopraxography Greyhound Galloping Animated 13.gif",
    "Descriptive Zoopraxography Buffalo Galloping Animated 13.gif",
    "Descriptive Zoopraxography Elephant Ambling Animated 12.gif",
    "Descriptive Zoopraxography Lion Walking Animated 13.gif",
    "Descriptive Zoopraxography Elk Galloping Animated 13.gif",
    "Descriptive Zoopraxography Pigeons Flying Animated 12.gif",
    "Muybridge horse walking animated.gif", "Muybridge horse pacing animated.gif",
    "Phénakistiscope Muybridge, animation.gif",
    "Portret van Eadweard Muybridge Eadweard Muybridge (1830, +1904.) (titel op object), RP-F-2001-7-509-65.jpg",
    "Eadweard Muybridge - Animal Locomotion, Plate 74 - Google Art Project.jpg",
    "Eadweard Muybridge - Animal Locomotion, Plate 136 - Google Art Project.jpg",
    "Eadweard Muybridge - Animal Locomotion, Plate 388 - Google Art Project.jpg",
    "Eadweard Muybridge - Animal Locomotion, Plate 467 - Google Art Project.jpg",
    "Eadweard Muybridge - Animal Locomotion, Plate 646 - Google Art Project.jpg",
    "Eadweard Muybridge - Animal Locomotion, Plate 686 - Google Art Project.jpg",
    "Eadweard Muybridge - Animal Locomotion, Plate 712 - Google Art Project.jpg",
    "Animal locomotion. Plate 709 (Boston Public Library).jpg", "Animal locomotion. Plate 563 (Boston Public Library).jpg",
] + [n for n in buscar("Gericault Derby Epsom", 6)]
inf = info(LISTA)
dest = RAIZ / "datos-crudos" / "img"; dest.mkdir(parents=True, exist_ok=True)
for n in LISTA:
    i = inf.get(n, {})
    if not i or i.get("falta"):
        print("FALTA", n); continue
    f = dest / n.replace("/", "_")
    if not f.exists():
        for intento in range(2):
            try:
                f.write_bytes(urllib.request.urlopen(urllib.request.Request(i["thumb"], headers={"User-Agent": UA}), timeout=60).read()); break
            except Exception as e:  # noqa: BLE001
                print("  aviso", e, file=sys.stderr); time.sleep(20)
        time.sleep(2)
    fr = getattr(Image.open(f), "n_frames", 1) if f.exists() else -1
    print(f'{fr:3d} {i["w"]}x{i["h"]} {i["LicenseShortName"][:20]:20} {n}')
