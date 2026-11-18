import {useEffect, useRef} from 'react';
import {IMG, disco, url} from '../content';
import {progresoFijado} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * El zoopraxiscopio: los seis discos de Descriptive Zoopraxography (1893) giran a saltos con el scroll, 1/pasos
 * de vuelta por fotograma y en sentido horario (comprobado contra las animaciones de Commons). A la izquierda
 * el disco entero; a la derecha una ventana ampliada sobre la figura de abajo, que es lo que se proyectaba.
 *
 * Guion de scroll (p), sección de 900 svh:
 *   0.00 – 0.08  título y explicación; el galgo quieto
 *   0.08 – 0.98  seis animales, un sexto del tramo cada uno: tres vueltas de disco por animal
 *                (39 o 36 saltos); fundido de 0.04 entre discos
 */

const ANIMALES = disco.animales;
const INI = 0.08;
const FIN = 0.98;
const TRAMO = (FIN - INI) / ANIMALES.length;
const VUELTAS = 3;
// La figura de abajo está a 0,83 R del centro; la imagen recorta 1,025 R a cada lado.
const FIGURA_Y = 0.5 + 0.83 / (2 * 1.025);
const AUMENTO = 2.6;

export function Disco() {
  const raizRef = useRef<HTMLElement>(null);
  const discoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const lupaRefs = useRef<(HTMLImageElement | null)[]>([]);
  const fichaRefs = useRef<(HTMLElement | null)[]>([]);
  const indiceRefs = useRef<(HTMLLIElement | null)[]>([]);
  const contadorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let pAnterior = -1;
    let clave = '';
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00003) return;
      pAnterior = p;
      const f = Math.max(0, (p - INI) / TRAMO);
      const actual = Math.min(ANIMALES.length - 1, Math.floor(f));
      const dentro = Math.min(1, f - actual);
      const pasos = IMG.discos[ANIMALES[actual].id as keyof typeof IMG.discos].pasos;
      const salto = p < INI ? 0 : Math.floor(dentro * pasos * VUELTAS);
      const k = `${actual}:${salto}`;
      if (k === clave) return;
      clave = k;
      const angulo = (salto * 360) / pasos;
      ANIMALES.forEach((_, j) => {
        const visibleDisco = j === actual;
        const d = discoRefs.current[j];
        const l = lupaRefs.current[j];
        if (d) {
          d.style.opacity = visibleDisco ? '1' : '0';
          if (visibleDisco) d.style.transform = `rotate(${angulo}deg)`;
        }
        if (l) {
          l.style.opacity = visibleDisco ? '1' : '0';
          if (visibleDisco) l.style.transform = `rotate(${angulo}deg)`;
        }
        const ficha = fichaRefs.current[j];
        if (ficha) {
          ficha.style.opacity = visibleDisco ? '1' : '0';
          ficha.style.visibility = visibleDisco ? 'visible' : 'hidden';
        }
        indiceRefs.current[j]?.setAttribute('data-actual', visibleDisco ? 'si' : 'no');
      });
      contadorRef.current!.textContent = `Salto ${String((salto % pasos) + 1).padStart(2, '0')} de ${pasos} · vuelta ${Math.min(VUELTAS, Math.floor(salto / pasos) + 1)} de ${VUELTAS}`;
    });
  }, []);

  return (
    <section ref={raizRef} id="disco" aria-labelledby="disco-titulo" className="relative" style={{height: '900svh'}}>
      <div className="rejilla sticky top-0 flex h-pantalla flex-col overflow-hidden px-4 pt-[4svh] pb-[3svh] sm:px-6 md:px-[5vw] md:pt-[6svh]">
        <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:gap-[4vw]">
          <div>
            <p className="etiqueta text-chispa">{disco.antetitulo}</p>
            <h2 id="disco-titulo" className="mt-2 font-display text-[clamp(2.25rem,4.8vw,4.75rem)] leading-[0.9] font-black uppercase">
              {disco.titulo}
            </h2>
          </div>
          <p className="mt-3 hidden text-[0.9375rem] leading-relaxed text-albumina/80 md:mt-1 md:block">{disco.cuerpo}</p>
          <p className="mt-2 text-[0.8125rem] leading-snug text-albumina/75 md:hidden">{disco.scroll}</p>
        </div>

        <div className="relative mt-4 grid min-h-0 flex-1 grid-cols-2 items-center gap-3 md:mt-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,0.9fr)] md:gap-[3vw]">
          {/* Disco entero */}
          <div className="relative mx-auto aspect-square w-full max-w-[min(40vw,58svh)]" aria-hidden="true">
            <div className="absolute inset-[-2%] rounded-full border border-albumina/15" />
            {ANIMALES.map((a, j) => (
              <img
                key={a.id}
                ref={(el) => {
                  discoRefs.current[j] = el;
                }}
                src={url(`disco/${a.id}.webp`)}
                alt=""
                width={900}
                height={900}
                loading={j === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 size-full rounded-full"
                style={{opacity: j === 0 ? 1 : 0, filter: 'invert(1) sepia(0.2) brightness(0.92)'}}
              />
            ))}
            {/* Marca de la ventana sobre la figura de abajo */}
            <div className="absolute left-1/2 size-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-chispa shadow-[0_0_24px_oklch(78%_0.13_210/0.5)]" style={{top: `${FIGURA_Y * 100}%`}} />
          </div>

          {/* Ventana: lo que se proyectaba */}
          <figure className="relative mx-auto aspect-square w-full max-w-[min(44vw,60svh)]">
            <div className="absolute inset-0 overflow-hidden rounded-full border-[3px] border-chispa bg-albumina shadow-[0_0_90px_oklch(78%_0.13_210/0.25)]">
              {ANIMALES.map((a, j) => (
                <img
                  key={a.id}
                  ref={(el) => {
                    lupaRefs.current[j] = el;
                  }}
                  src={url(`disco/${a.id}.webp`)}
                  alt=""
                  width={900}
                  height={900}
                  loading={j === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute max-w-none"
                  style={{
                    width: `${AUMENTO * 100}%`,
                    height: `${AUMENTO * 100}%`,
                    left: `${50 - AUMENTO * 50}%`,
                    top: `${50 - AUMENTO * FIGURA_Y * 100}%`,
                    transformOrigin: '50% 50%',
                    opacity: j === 0 ? 1 : 0,
                    filter: 'sepia(0.3) contrast(1.1)',
                  }}
                />
              ))}
              <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_60px_oklch(14%_0.004_230/0.55)]" />
            </div>
            <figcaption className="sr-only">Ventana ampliada sobre la figura de abajo del disco, que gira a saltos con el scroll</figcaption>
          </figure>

          {/* Ficha del animal */}
          <div className="col-span-2 md:col-span-1">
            <ol className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.6875rem] text-albumina-3 md:text-[0.75rem]" aria-hidden="true">
              {ANIMALES.map((a, j) => (
                <li
                  key={a.id}
                  ref={(el) => {
                    indiceRefs.current[j] = el;
                  }}
                  data-actual={j === 0 ? 'si' : 'no'}
                  className="indice"
                >
                  {a.nombre}
                </li>
              ))}
            </ol>
            <div className="relative mt-3 h-[8.5rem] md:mt-5 md:h-[12rem]">
              {ANIMALES.map((a, j) => (
                <article
                  key={a.id}
                  ref={(el) => {
                    fichaRefs.current[j] = el;
                  }}
                  className="absolute inset-0"
                  style={{opacity: j === 0 ? 1 : 0, visibility: j === 0 ? 'visible' : 'hidden'}}
                >
                  <h3 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-bold">
                    {a.nombre} <span className="font-sans text-[0.5em] font-normal text-chispa italic">{a.paso}</span>
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-albumina/80 md:text-[0.9375rem]">{a.nota}</p>
                </article>
              ))}
            </div>
            <p ref={contadorRef} className="font-mono text-[0.6875rem] text-albumina-3 tabular-nums md:text-[0.75rem]">
              Salto 01 de 13 · vuelta 1 de 3
            </p>
            <p className="mt-3 hidden text-[0.8125rem] leading-snug text-albumina-3 md:block">{disco.scroll}</p>
          </div>
        </div>
        <p className="mt-2 font-mono text-[0.625rem] text-albumina-3 md:text-[0.6875rem]">{disco.fuente}</p>
      </div>
    </section>
  );
}
