import {useEffect, useRef} from 'react';
import {IMG, pad, portada, url} from '../content';
import {easeOutCubic, lerp, progresoFijado, tramo} from '../lib/math';
import {enCadaFotograma} from '../lib/scroll';

/**
 * Portada: la pista de Palo Alto. Doce cámaras en fila; la yegua cruza con el scroll y cada cámara que pasa
 * se enciende y deja su foto en la tira de contactos. Después, las once fotos del galope se proyectan seguidas.
 *
 * Guion de scroll (p), sección de 760 svh:
 *   0.00 – 0.08  título y entradilla sobre la rejilla; la pista espera
 *   0.08 – 0.56  la yegua cruza: cámara k se dispara en (k-1)/11 del tramo; HUD de cámara, tiempo y metros
 *   0.54 – 0.66  el título se va; la tira completa y los cuatro datos impresos en la tarjeta
 *   0.66 – 0.88  proyector: las 11 fotos del galope en bucle (tres zancadas), la pista se apaga
 *   0.86 – 1.00  la tarjeta original entera con su pie
 */

const N = IMG.sallie.n; // 12
const CORRIDOS = N - 1; // el cuadro 12 es la yegua parada
const FOTO = (k: number) => url(`sallie/${pad(k)}.webp`);
const ESPACIO = 0.6858; // 27 pulgadas en metros

export function Portada() {
  const raizRef = useRef<HTMLElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);
  const pistaRef = useRef<HTMLDivElement>(null);
  const caballoRef = useRef<HTMLImageElement>(null);
  const caballoCajaRef = useRef<HTMLDivElement>(null);
  const camRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ranuraRefs = useRef<(HTMLDivElement | null)[]>([]);
  const datosRef = useRef<HTMLDivElement>(null);
  const proyRef = useRef<HTMLDivElement>(null);
  const proyImgRef = useRef<HTMLImageElement>(null);
  const tarjetaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pAnterior = -1;
    let fotoAnterior = -1;
    let proyAnterior = -1;
    const hud = (id: string) => [...(raizRef.current?.querySelectorAll<HTMLElement>(`[data-hud="${id}"]`) ?? [])];
    const HUD = {camara: hud('camara'), tiempo: hud('tiempo'), distancia: hud('distancia')};
    const escribe = (els: HTMLElement[], v: string) => els.forEach((el) => (el.textContent = v));
    return enCadaFotograma(() => {
      const raiz = raizRef.current;
      if (!raiz) return;
      const {p, visible} = progresoFijado(raiz);
      if (!visible || Math.abs(p - pAnterior) < 0.00003) return;
      pAnterior = p;

      // Título: se aparta cuando arranca la carrera.
      const salida = tramo(p, 0.05, 0.12);
      tituloRef.current!.style.opacity = String((1 - salida * 0.82) * (1 - tramo(p, 0.54, 0.58)));
      tituloRef.current!.style.transform = `translate3d(0, ${-salida * 5}vh, 0)`;

      // Carrera.
      const t = tramo(p, 0.08, 0.56);
      const pasadas = p < 0.08 ? 0 : Math.min(N, Math.floor(t * CORRIDOS + 1e-6) + 1);
      const foto = Math.max(1, Math.min(CORRIDOS, pasadas));
      if (foto !== fotoAnterior) {
        fotoAnterior = foto;
        caballoRef.current!.src = FOTO(foto);
      }
      caballoCajaRef.current!.style.left = `${lerp(13, 87, t).toFixed(3)}%`;
      caballoCajaRef.current!.style.opacity = String(p < 0.08 ? 0.35 : 1);
      camRefs.current.forEach((el, i) => {
        if (!el) return;
        const k = i + 1;
        // Destello: la cámara se enciende al pasar y se queda en rescoldo.
        const d = t * CORRIDOS - (k - 1);
        const encendida = k <= pasadas;
        el.dataset.estado = !encendida ? 'espera' : d < 0.6 ? 'disparo' : 'hecha';
      });
      ranuraRefs.current.forEach((el, i) => {
        if (!el) return;
        const k = i + 1;
        const lleno = k === N ? tramo(p, 0.55, 0.58) : k <= pasadas ? 1 : 0;
        el.style.opacity = String(lleno);
      });
      const segundos = (t * CORRIDOS) / 25;
      escribe(HUD.camara, `${pad(Math.max(pasadas, 0))} / ${N}`);
      escribe(HUD.tiempo, `${segundos.toFixed(2)} s`);
      escribe(HUD.distancia, `${(t * CORRIDOS * ESPACIO).toFixed(1)} m`);

      // Datos impresos en la tarjeta.
      const dat = tramo(p, 0.57, 0.61) * (1 - tramo(p, 0.64, 0.67));
      datosRef.current!.style.opacity = String(dat);

      // Proyector: la pista se apaga y la pantalla corre en bucle.
      const proy = tramo(p, 0.66, 0.7) * (1 - tramo(p, 0.86, 0.89));
      pistaRef.current!.style.opacity = String(1 - tramo(p, 0.65, 0.69));
      proyRef.current!.style.opacity = String(proy);
      proyRef.current!.style.visibility = proy > 0.01 ? 'visible' : 'hidden';
      const cuadro = 1 + (Math.floor(tramo(p, 0.67, 0.87) * CORRIDOS * 3) % CORRIDOS);
      if (cuadro !== proyAnterior) {
        proyAnterior = cuadro;
        proyImgRef.current!.src = FOTO(cuadro);
      }

      // Tarjeta entera.
      const tar = easeOutCubic(tramo(p, 0.87, 0.95));
      tarjetaRef.current!.style.opacity = String(tar);
      tarjetaRef.current!.style.visibility = tar > 0.01 ? 'visible' : 'hidden';
      tarjetaRef.current!.style.transform = `translate3d(0, ${lerp(4, 0, tar)}vh, 0) scale(${lerp(0.96, 1, tar)})`;
    });
  }, []);

  return (
    <section ref={raizRef} id="pista" aria-labelledby="titulo" className="relative" style={{height: '760svh'}}>
      <div className="rejilla sticky top-0 flex h-pantalla flex-col overflow-hidden px-4 pt-[5svh] pb-[3svh] sm:px-6 md:px-[5vw] md:pt-[7svh]">
        <div ref={tituloRef} className="relative z-10 md:max-w-[62vw]">
          <p className="etiqueta text-chispa">{portada.antetitulo}</p>
          <h1 id="titulo" className="mt-2 font-display text-hero font-black tracking-[-0.01em] text-albumina uppercase">
            {portada.titulo}
            <span className="mt-1 block font-sans text-[0.2em] font-normal tracking-normal normal-case italic text-albumina-2">{portada.subtitulo}</span>
          </h1>
          <p className="mt-4 max-w-[38rem] text-[0.9375rem] leading-relaxed text-albumina/80 md:text-lead">{portada.entradilla}</p>
          <p className="mt-3 hidden font-mono text-[0.75rem] text-albumina-3 md:block">↓ {portada.pista}</p>
        </div>

        {/* HUD */}
        <dl className="absolute top-[5svh] right-4 z-10 hidden gap-5 text-right md:top-[7svh] md:right-[5vw] md:grid" aria-hidden="true">
          {portada.hud.map((h) => (
            <div key={h.id}>
              <dt className="etiqueta text-albumina-3">{h.etiqueta}</dt>
              <dd
                data-hud={h.id}
                className="font-mono text-[1.375rem] text-albumina tabular-nums"
              >
                0
              </dd>
            </div>
          ))}
        </dl>

        {/* Pista con las cámaras, la yegua y la tira de contactos. */}
        <div ref={pistaRef} className="relative mt-auto mb-[2svh]" aria-hidden="true">
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 md:hidden">
            {portada.hud.map((h) => (
              <p key={h.id} className="font-mono text-[0.6875rem] text-albumina-3">
                {h.etiqueta}{' '}
                <span data-hud={h.id} className="text-albumina tabular-nums" />
              </p>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-12 gap-[0.6vw]">
            {Array.from({length: N}, (_, i) => (
              <div
                key={i}
                ref={(el) => {
                  camRefs.current[i] = el;
                }}
                data-estado="espera"
                className="camara relative flex h-[2.6rem] items-center justify-center rounded-[2px] border md:h-[3.4rem]"
              >
                <span className="lente block size-[0.9rem] rounded-full border-2 md:size-[1.3rem]" />
                <span className="absolute -bottom-4 font-mono text-[0.5625rem] text-albumina-3 md:text-[0.625rem]">{i + 1}</span>
              </div>
            ))}
          </div>
          {/* Hilos y pista */}
          <div className="relative mt-6 h-[22svh] md:h-[26svh]">
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-albumina/70" />
            {Array.from({length: N}, (_, i) => (
              <span key={i} className="absolute bottom-0 h-full w-px bg-albumina/10" style={{left: `${((i + 0.5) / N) * 100}%`}} />
            ))}
            <div ref={caballoCajaRef} className="absolute bottom-0 h-full -translate-x-1/2" style={{left: '13%'}}>
              <img ref={caballoRef} src={FOTO(1)} alt="" width={IMG.sallie.w} height={IMG.sallie.h} className="h-full w-auto max-w-none mix-blend-screen" style={{filter: 'invert(1) sepia(0.25) contrast(1.6) brightness(0.82)'}} />
            </div>
          </div>
          {/* Tira de contactos */}
          <div className="mt-4 grid grid-cols-6 gap-1 md:grid-cols-12 md:gap-[0.4vw]">
            {Array.from({length: N}, (_, i) => (
              <div key={i} className="relative aspect-[437/279] border border-albumina/15 bg-negro-2">
                <div
                  ref={(el) => {
                    ranuraRefs.current[i] = el;
                  }}
                  className="absolute inset-0 transition-opacity duration-200"
                  style={{opacity: 0}}
                >
                  <img src={FOTO(i + 1)} alt="" width={IMG.sallie.w} height={IMG.sallie.h} className="albumina block size-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Los cuatro datos impresos en la tarjeta. */}
        <div ref={datosRef} className="pointer-events-none absolute inset-x-4 top-[30svh] z-10 grid grid-cols-2 gap-x-6 gap-y-4 opacity-0 md:inset-x-[5vw] md:top-[34svh] md:grid-cols-4">
          {portada.datosTarjeta.map((d) => (
            <p key={d.cifra} className="border-t border-chispa/60 pt-2">
              <span className="block font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-none font-bold text-chispa">{d.cifra}</span>
              <span className="mt-1 block text-[0.8125rem] leading-snug text-albumina/80 md:text-[0.9375rem]">{d.texto}</span>
            </p>
          ))}
        </div>

        {/* Proyector */}
        <div ref={proyRef} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-negro/92 px-4" style={{opacity: 0, visibility: 'hidden'}}>
          <div className="relative w-full max-w-[min(92vw,62rem)] overflow-hidden rounded-[3px] border border-albumina/20 shadow-[0_0_120px_oklch(78%_0.13_210/0.18)]">
            <img ref={proyImgRef} src={FOTO(1)} alt="Sallie Gardner al galope, las once fotos de 1878 proyectadas una tras otra" width={IMG.sallie.w} height={IMG.sallie.h} className="albumina block w-full" />
          </div>
          <p className="mt-5 max-w-[40rem] text-center text-body text-albumina/85">{portada.proyector}</p>
        </div>

        {/* Tarjeta */}
        <div ref={tarjetaRef} className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-negro px-4" style={{opacity: 0, visibility: 'hidden'}}>
          <img src={url('sallie/tarjeta.webp')} alt="Tarjeta The Horse in Motion de 1878: doce fotos de Sallie Gardner en tres filas y el texto de Muybridge al pie" width={IMG.tarjeta.w} height={IMG.tarjeta.h} loading="lazy" decoding="async" className="albumina block max-h-[72svh] w-auto max-w-full" />
          <p className="mt-4 max-w-[44rem] text-center text-[0.875rem] leading-snug text-albumina/75 md:text-[0.9375rem]">{portada.tarjeta}</p>
        </div>
      </div>
    </section>
  );
}
