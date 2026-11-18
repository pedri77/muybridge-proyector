import {IMG, commons, creditos, url} from '../content';
import {useAparecer} from '../hooks/useAparecer';
import {irA} from '../lib/scroll';

/** Fuentes, licencia de cada imagen y la tarjeta de 1878 otra vez. */
export function Creditos() {
  const ref = useAparecer<HTMLElement>();
  return (
    <footer ref={ref} aria-labelledby="creditos-titulo" className="bg-negro-2 px-4 pt-[14svh] pb-10 sm:px-6 md:px-[6vw]">
      <div className="mx-auto grid max-w-[80rem] gap-10 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-16">
        <figure data-aparece className="max-w-[24rem] md:max-w-none">
          <img src={url('sallie/tarjeta.webp')} alt="Tarjeta The Horse in Motion de 1878" width={IMG.tarjeta.w} height={IMG.tarjeta.h} loading="lazy" decoding="async" className="albumina block w-full" />
          <figcaption className="mt-3 text-[0.875rem] leading-snug text-albumina-3">The Horse in Motion, 1878. Copyright de Muybridge; hoy, dominio público.</figcaption>
        </figure>
        <div>
          <h2 id="creditos-titulo" data-aparece className="font-display text-display font-black uppercase">
            {creditos.titulo}
          </h2>
          <ul className="mt-6 grid gap-2.5 text-body">
            {creditos.fuentes.map((f) => (
              <li key={f.url}>
                <a href={f.url} target="_blank" rel="noreferrer" className="underline decoration-albumina/35 underline-offset-4 hover:decoration-chispa">
                  {f.nombre} ↗
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-6 grid gap-2 text-[0.9375rem] text-albumina/75">
            {creditos.imagenes.map((c) => (
              <li key={c.fichero} className="border-b border-negro-3 pb-2">
                <a href={commons(c.fichero)} target="_blank" rel="noreferrer" className="text-albumina underline decoration-albumina/30 underline-offset-4 hover:decoration-chispa">
                  {c.texto}
                </a>
                . Dominio público, vía Wikimedia Commons.
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[52rem] text-[0.9375rem] text-albumina/70">{creditos.metodo}</p>
          <button type="button" onClick={() => irA('#pista')} className="mt-8 border border-albumina/60 px-5 py-2.5 font-mono text-[0.8125rem] transition-colors hover:border-chispa hover:bg-chispa hover:text-negro">
            ↑ Volver a la pista
          </button>
          <p className="mt-10 font-display text-[1.75rem] font-bold text-chispa uppercase">{creditos.firma}</p>
        </div>
      </div>
    </footer>
  );
}
