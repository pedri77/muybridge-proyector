import {useEffect, useRef} from 'react';
import {IMG, legado, pad, url} from '../content';
import {easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Después de la yegua: una pared de láminas de Animal Locomotion, fotos y discos que se mueve con el scroll y
 * se aleja; encima, las cifras y una cronología corta hasta Duchamp.
 *
 * Guion de scroll (p), sección de 560 svh:
 *   0.00 – 0.30  la pared se aleja (escala 1,7 → 1); las fotos y discos de la pared avanzan con el scroll
 *   0.28 – 0.40  la pared se oscurece; título y cuerpo
 *   0.38 – 0.58  cuatro cifras que cuentan hasta su valor
 *   0.58 – 0.90  cinco hitos, uno tras otro
 *   0.90 – 1.00  pie: Kingston upon Thames
 */

type Pieza = {tipo: 'lamina'; id: keyof typeof IMG.laminas} | {tipo: 'sallie' | 'annie'} | {tipo: 'disco'; id: keyof typeof IMG.discos};
const PARED: Pieza[] = [
  {tipo: 'lamina', id: 'l563'},
  {tipo: 'annie'},
  {tipo: 'disco', id: 'bisonte'},
  {tipo: 'lamina', id: 'l686'},
  {tipo: 'sallie'},
  {tipo: 'lamina', id: 'l709'},
  {tipo: 'disco', id: 'palomas'},
  {tipo: 'lamina', id: 'l712'},
];

export function Legado() {
  const raizRef = useRef<HTMLElement>(null);
  const paredRef = useRef<HTMLDivElement>(null);
  const velRef = useRef<HTMLDivElement>(null);
  const cabRef = useRef<HTMLDivElement>(null);
  const cifraRefs = useRef<(HTMLElement | null)[]>([]);
  const hitoRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pieRef = useRef<HTMLParagraphElement>(null);
  const vivas = useRef<{el: HTMLImageElement; tipo: string; id?: string}[]>([]);

  useEffect(() => {
    let pAnterior = -1;
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00003) return;
      pAnterior = p;
      const k = easeOutCubic(tramo(p, 0, 0.3));
      paredRef.current!.style.transform = `scale(${lerp(1.7, 1, k)})`;
      velRef.current!.style.opacity = String(lerp(0, 0.82, tramo(p, 0.28, 0.38)));

      // Piezas vivas: la foto cambia o el disco salta con el scroll.
      const paso = Math.floor(p * 160);
      vivas.current.forEach((v) => {
        if (v.tipo === 'sallie') {
          const n = 1 + (paso % (IMG.sallie.n - 1));
          if (v.el.dataset.n !== String(n)) {
            v.el.dataset.n = String(n);
            v.el.src = url(`sallie/${pad(n)}.webp`);
          }
        } else if (v.tipo === 'annie') {
          const n = paso % IMG.annie.n;
          if (v.el.dataset.n !== String(n)) {
            v.el.dataset.n = String(n);
            v.el.src = url(`annie/${pad(n)}.webp`);
          }
        } else if (v.tipo === 'disco' && v.id) {
          const pasos = IMG.discos[v.id as keyof typeof IMG.discos].pasos;
          v.el.style.transform = `rotate(${((paso % pasos) * 360) / pasos}deg)`;
        }
      });

      const cab = tramo(p, 0.3, 0.38);
      cabRef.current!.style.opacity = String(cab);
      cabRef.current!.style.transform = `translate3d(0, ${(1 - cab) * 16}px, 0)`;
      legado.cifras.forEach((c, i) => {
        const el = cifraRefs.current[i];
        if (!el) return;
        const t = easeOutCubic(tramo(p, 0.38 + i * 0.04, 0.5 + i * 0.04));
        el.textContent = Math.round(c.cifra * t).toLocaleString('es-ES');
        (el.parentElement as HTMLElement).style.opacity = String(tramo(p, 0.37 + i * 0.04, 0.4 + i * 0.04));
      });
      hitoRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = tramo(p, 0.58 + i * 0.06, 0.62 + i * 0.06);
        el.style.opacity = String(t);
        el.style.transform = `translate3d(${(1 - t) * 18}px, 0, 0)`;
      });
      pieRef.current!.style.opacity = String(tramo(p, 0.9, 0.95));
    });
  }, []);

  const registra = (tipo: string, id?: string) => (el: HTMLImageElement | null) => {
    if (el && !vivas.current.some((v) => v.el === el)) vivas.current.push({el, tipo, id});
  };

  return (
    <section ref={raizRef} id="legado" aria-labelledby="legado-titulo" className="relative" style={{height: '560svh'}}>
      <div className="sticky top-0 h-pantalla overflow-hidden bg-negro">
        {/* Pared */}
        <div ref={paredRef} className="absolute inset-[-4%] grid origin-center grid-cols-2 gap-2 p-2 md:grid-cols-4 md:gap-3 md:p-3" aria-hidden="true">
          {PARED.map((pz, i) => (
            <div key={i} className="relative min-h-0 overflow-hidden bg-negro-2">
              {pz.tipo === 'lamina' && (
                <img src={url(`laminas/${pz.id}.webp`)} alt="" width={IMG.laminas[pz.id].w} height={IMG.laminas[pz.id].h} loading="lazy" decoding="async" className="albumina block size-full object-cover" />
              )}
              {pz.tipo === 'sallie' && <img ref={registra('sallie')} src={url('sallie/01.webp')} alt="" width={IMG.sallie.w} height={IMG.sallie.h} loading="lazy" decoding="async" className="albumina block size-full object-cover" />}
              {pz.tipo === 'annie' && <img ref={registra('annie')} src={url('annie/00.webp')} alt="" width={IMG.annie.w} height={IMG.annie.h} loading="lazy" decoding="async" className="albumina block size-full object-cover" />}
              {pz.tipo === 'disco' && (
                <div className="flex size-full items-center justify-center bg-albumina">
                  <img ref={registra('disco', pz.id)} src={url(`disco/${pz.id}.webp`)} alt="" width={900} height={900} loading="lazy" decoding="async" className="aspect-square h-[92%] w-auto" style={{filter: 'sepia(0.3)'}} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div ref={velRef} className="absolute inset-0 bg-negro" style={{opacity: 0}} />

        {/* Texto */}
        <div className="relative flex h-full flex-col justify-center px-4 py-[5svh] sm:px-6 md:px-[6vw]">
          <div ref={cabRef} style={{opacity: 0}}>
            <p className="etiqueta text-chispa">{legado.antetitulo}</p>
            <h2 id="legado-titulo" className="mt-2 font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.86] font-black uppercase">
              {legado.titulo}
            </h2>
            <p className="mt-3 max-w-[44rem] text-[0.9375rem] leading-relaxed text-albumina/85 md:text-body">{legado.cuerpo}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:mt-8 md:grid-cols-4 md:max-w-[60rem]">
            {legado.cifras.map((c, i) => (
              <p key={c.texto} className="border-t border-albumina/25 pt-2" style={{opacity: 0}}>
                <span
                  ref={(el) => {
                    cifraRefs.current[i] = el;
                  }}
                  className="block font-mono text-[clamp(1.5rem,2.8vw,2.5rem)] text-chispa tabular-nums"
                >
                  0
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-snug text-albumina/75">{c.texto}</span>
              </p>
            ))}
          </div>
          <ol className="mt-5 grid max-w-[54rem] gap-1.5 md:mt-8 md:gap-2.5">
            {legado.hitos.map((h, i) => (
              <li
                key={h.ano}
                ref={(el) => {
                  hitoRefs.current[i] = el;
                }}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 text-[0.8125rem] leading-snug md:grid-cols-[6rem_minmax(0,1fr)] md:text-[0.9375rem]"
                style={{opacity: 0}}
              >
                <span className="font-mono text-chispa">{h.ano}</span>
                <span className="text-albumina/85">{h.texto}</span>
              </li>
            ))}
          </ol>
          <p ref={pieRef} className="mt-5 max-w-[44rem] text-[0.8125rem] text-albumina-3 italic md:mt-8 md:text-[0.9375rem]" style={{opacity: 0}}>
            {legado.pie}
          </p>
        </div>
      </div>
    </section>
  );
}
