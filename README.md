# Muybridge, fotograma a fotograma

Web de scroll sobre Eadweard Muybridge: en 1878, doce cámaras demostraron que un caballo al galope despega las cuatro patas a la vez. El scroll hace de pista y de proyector.

**Demo:** https://pedri77.github.io/muybridge-proyector/

## Qué hay

1. **La pista de Palo Alto.** Doce cámaras en fila; Sallie Gardner cruza con el scroll y cada cámara se dispara y deja su foto en la tira de contactos. Datos de la propia tarjeta de 1878: una foto cada 27 pulgadas y cada 1/25 s, exposición de menos de 1/2000 s. Después, las once fotos proyectadas en bucle y la tarjeta entera.
2. **La pregunta.** El Derby de Epsom de Géricault (1821) frente a la lámina 626 de *Animal Locomotion* (Annie G., 1887), foto a foto: las cuatro patas dejan el suelo recogidas, no estiradas.
3. **El zoopraxiscopio.** Seis discos de *Descriptive Zoopraxography* (1893) que giran a saltos con el scroll, 1/13 o 1/12 de vuelta por paso, con una ventana ampliada sobre la figura que se proyectaba.
4. **781 láminas.** Una pared de láminas, fotos y discos que se mueve con el scroll, con las cifras y una cronología corta hasta Duchamp.

## Material

Todo de dominio público, vía Wikimedia Commons: la tarjeta *The Horse in Motion* (1878), láminas de *Animal Locomotion* (1887; solo de animales), los discos de *Descriptive Zoopraxography* (1893), la animación de la lámina 626 y el cuadro de Géricault (Louvre). Datos históricos de la tarjeta original y de Wikipedia (The Horse in Motion, Eadweard Muybridge, Zoopraxiscope).

Las imágenes solo se han recortado, girado y ordenado; ninguna se ha generado con IA. El sentido de giro de los discos se comprobó contra las animaciones de Commons.

## Cómo se hizo

React 19, Vite, Tailwind 4 y Lenis. Un único bucle `requestAnimationFrame` lee el progreso de cada sección fijada y escribe estilos directamente en el DOM; el scroll no re-renderiza React. Respeta `prefers-reduced-motion`.

```bash
npm install
npm run dev        # http://localhost:3022
uv run --no-project --with pillow python scripts/candidatos.py    # descarga miniaturas a datos-crudos/
uv run --no-project --with pillow python scripts/fotogramas.py    # genera public/img y src/datos/imagenes.json
```

Hecha con ayuda de IA (Claude).
