import {useEffect} from 'react';
import {Creditos} from './components/Creditos';
import {Disco} from './components/Disco';
import {Legado} from './components/Legado';
import {Portada} from './components/Portada';
import {Pregunta} from './components/Pregunta';
import {useMovimientoReducido} from './hooks/useMovimientoReducido';
import {iniciarScroll} from './lib/scroll';

/** Orden del guion: la pista de 1878 · la pregunta de las cuatro patas · el zoopraxiscopio · 781 láminas · fuentes. */
export default function App() {
  const reducido = useMovimientoReducido();
  useEffect(() => iniciarScroll(reducido), [reducido]);
  return (
    <main>
      <Portada />
      <Pregunta />
      <Disco />
      <Legado />
      <Creditos />
    </main>
  );
}
