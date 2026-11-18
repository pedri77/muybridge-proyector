import {useEffect, useRef} from 'react';
import {IMG, pad, pregunta, url} from '../content';
import {easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * La pregunta de 1878: ¿despega el caballo las cuatro patas? Primero el cuadro de Géricault (1821), luego la
 * lámina 626 (Annie G., 1887) fotograma a fotograma, y al final los dos frente a frente.
 *
 * Guion de scroll (p), sección de 640 svh, papel de albúmina con rejilla:
 *   0.00 – 0.20  el Derby de Epsom ocupa la escena; texto del cuadro y, desde 0.10, el de Stanford
 *   0.20 – 0.70  Annie G.: 15 fotos repartidas en el tramo; en las dos primeras, aviso «las cuatro en el aire»
 *   0.72 – 0.90  frente a frente: el cuadro y el fotograma 2 de la lámina, con la respuesta
 *   0.90 – 1.00  nota sobre el jinete y Nope
 */

const N = IMG.annie.n; // 15
const EN_EL_AIRE = new Set([0, 1]); // los que la lámina numera 2 y 3: patas recogidas, ninguna apoyada
const FOTO = (i: number) => url(`annie/${pad(i)}.webp`);
const DERBY = IMG.laminas.derby;

export function Pregunta() {
  const raizRef = useRef<HTMLElement>(null);
  const fases = useRef<(HTMLElement | null)[]>([]);
  const textos = useRef<(HTMLElement | null)[]>([]);
  const fotoRef = useRef<HTMLImageElement>(null);
  const avisoRef = useRef<HTMLParagraphElement>(null);
  const contadorRef = useRef<HTMLParagraphElement>(null);
  const miniRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let pAnterior = -1;
    let fotoAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00003) return;
      pAnterior = p;

      // Opacidad de cada fase (cuadro, lámina, frente a frente).
      const o = [1 - tramo(p, 0.18, 0.22), tramo(p, 0.19, 0.23) * (1 - tramo(p, 0.7, 0.74)), tramo(p, 0.72, 0.77)];
      fases.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(o[i]);
        el.style.visibility = o[i] > 0.01 ? 'visible' : 'hidden';
      });
      // Textos de la columna izquierda: cuadro, stanford, lámina, respuesta, nope.
      const t = [
        1 - tramo(p, 0.1, 0.13),
        tramo(p, 0.1, 0.13) * (1 - tramo(p, 0.19, 0.22)),
        tramo(p, 0.2, 0.24) * (1 - tramo(p, 0.7, 0.73)),
        tramo(p, 0.73, 0.78),
        tramo(p, 0.9, 0.95),
      ];
      textos.current.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = String(t[i]);
        el.style.visibility = t[i] > 0.01 ? 'visible' : 'hidden';
        el.style.transform = `translate3d(0, ${(1 - Math.min(1, t[i])) * 10}px, 0)`;
      });

      // El cuadro se acerca despacio mientras está en escena.
      const z = easeOutCubic(tramo(p, 0, 0.2));
      (fases.current[0]?.firstElementChild as HTMLElement | null)?.style.setProperty('transform', `scale(${lerp(1.08, 1, z)})`);

      // Annie G. fotograma a fotograma.
      const i = Math.min(N - 1, Math.floor(tramo(p, 0.2, 0.7) * N));
      if (i !== fotoAnterior) {
        fotoAnterior = i;
        fotoRef.current!.src = FOTO(i);
        const aire = EN_EL_AIRE.has(i);
        avisoRef.current!.dataset.activo = aire ? 'si' : 'no';
        contadorRef.current!.textContent = `Foto ${pad(i + 1)} de ${N}`;
        miniRefs.current.forEach((b, j) => b && (b.dataset.actual = j === i ? 'si' : 'no'));
      }
    });
  }, []);

  return (
    <section ref={raizRef} id="pregunta" aria-labelledby="pregunta-titulo" className="relative" style={{height: '640svh'}}>
      <div className="rejilla-clara sticky top-0 flex h-pantalla flex-col overflow-hidden text-tinta md:flex-row">
        {/* Columna de texto */}
        <div className="relative z-10 flex flex-col px-4 pt-[4svh] sm:px-6 md:w-[36vw] md:shrink-0 md:justify-center md:px-[4.5vw] md:py-[6svh]">
          <p className="etiqueta text-chispa-osc">{pregunta.antetitulo}</p>
          <h2 id="pregunta-titulo" className="mt-2 font-display text-[clamp(2.25rem,4.6vw,4.5rem)] leading-[0.92] font-black uppercase">
            {pregunta.titulo}
          </h2>
          <div className="relative mt-3 h-[13.5rem] md:mt-8 md:h-[17rem]">
            {[pregunta.cuadro, pregunta.stanford, pregunta.lamina].map((txt, k) => (
              <p
                key={k}
                ref={(el) => {
                  textos.current[k] = el;
                }}
                className="absolute inset-0 text-[0.9375rem] leading-relaxed text-tinta-2 md:text-body"
                style={{opacity: k === 0 ? 1 : 0, visibility: k === 0 ? 'visible' : 'hidden'}}
              >
                {txt}
              </p>
            ))}
            <div
              ref={(el) => {
                textos.current[3] = el;
              }}
              className="absolute inset-0"
              style={{opacity: 0, visibility: 'hidden'}}
            >
              <p className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight font-bold text-tinta">{pregunta.respuesta}</p>
              <p className="mt-2 text-[0.875rem] leading-snug text-tinta-2 md:mt-3 md:text-body md:leading-relaxed">{pregunta.explicacion}</p>
              <p
                ref={(el) => {
                  textos.current[4] = el;
                }}
                className="mt-3 border-l-2 border-chispa-osc pl-3 text-[0.8125rem] leading-snug text-tinta-2 md:mt-5 md:text-[0.9375rem]"
                style={{opacity: 0, visibility: 'hidden'}}
              >
                {pregunta.nope}
              </p>
            </div>
          </div>
        </div>

        {/* Escena */}
        <div className="relative min-h-0 flex-1">
          {/* 1. El cuadro */}
          <figure
            ref={(el) => {
              fases.current[0] = el;
            }}
            className="absolute inset-0 overflow-hidden"
          >
            <img src={url('laminas/derby.webp')} alt="El Derby de Epsom de Géricault: cuatro caballos de carreras con las patas delanteras y traseras estiradas, como si volaran sobre la hierba" width={DERBY.w} height={DERBY.h} className="block size-full object-cover object-[40%_60%]" />
            <figcaption className="absolute right-3 bottom-3 bg-albumina/90 px-2 py-1 font-mono text-[0.6875rem] text-tinta-2">Géricault, El Derby de Epsom, 1821</figcaption>
          </figure>

          {/* 2. La lámina, foto a foto */}
          <div
            ref={(el) => {
              fases.current[1] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-[4vw]"
            style={{opacity: 0, visibility: 'hidden'}}
          >
            <div className="relative w-full max-w-[44rem] border-[6px] border-tinta bg-tinta shadow-[0_24px_50px_oklch(20%_0.008_60/0.25)]">
              <img ref={fotoRef} src={FOTO(0)} alt="Annie G. al galope, lámina 626 de Animal Locomotion, foto a foto" width={IMG.annie.w} height={IMG.annie.h} className="albumina block w-full" />
              <p ref={avisoRef} data-activo="si" className="aviso-aire absolute top-3 left-3 bg-chispa px-2.5 py-1 font-mono text-[0.75rem] font-semibold text-negro md:text-[0.875rem]">
                {pregunta.aire}
              </p>
            </div>
            <p ref={contadorRef} className="mt-3 font-mono text-[0.75rem] text-tinta-2 tabular-nums">
              Foto 01 de {N}
            </p>
            <div className="mt-3 grid w-full max-w-[44rem] grid-cols-[repeat(15,minmax(0,1fr))] gap-[3px]" aria-hidden="true">
              {Array.from({length: N}, (_, j) => (
                <span
                  key={j}
                  ref={(el) => {
                    miniRefs.current[j] = el;
                  }}
                  data-actual={j === 0 ? 'si' : 'no'}
                  className="mini relative block"
                >
                  <img src={FOTO(j)} alt="" width={IMG.annie.w} height={IMG.annie.h} className="block w-full" />
                  {EN_EL_AIRE.has(j) && <span className="absolute -bottom-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-chispa-osc" />}
                </span>
              ))}
            </div>
          </div>

          {/* 3. Frente a frente */}
          <div
            ref={(el) => {
              fases.current[2] = el;
            }}
            className="absolute inset-0 grid grid-rows-2 gap-3 px-4 pb-[3svh] md:grid-cols-2 md:grid-rows-1 md:items-center md:gap-[2vw] md:px-[3vw] md:pb-0"
            style={{opacity: 0, visibility: 'hidden'}}
          >
            {[
              {src: url('laminas/derby.webp'), w: DERBY.w, h: DERBY.h, pos: 'object-[30%_62%]', alt: 'Detalle del cuadro de Géricault: caballo con las cuatro patas estiradas en el aire'},
              {src: FOTO(1), w: IMG.annie.w, h: IMG.annie.h, pos: 'object-center', alt: 'Annie G. con las cuatro patas recogidas bajo el cuerpo y ninguna en el suelo'},
            ].map((f, k) => (
              <figure key={k} className="relative min-h-0 md:h-[56svh]">
                <img src={f.src} alt={f.alt} width={f.w} height={f.h} loading="lazy" decoding="async" className={`block size-full object-cover ${f.pos} ${k === 1 ? 'albumina' : ''} border-[6px] border-tinta`} />
                <figcaption className="absolute top-3 left-3 bg-tinta px-2 py-1 font-mono text-[0.75rem] text-albumina">{pregunta.comparar[k]}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
