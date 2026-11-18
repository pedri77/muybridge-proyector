import imagenes from './datos/imagenes.json';

/**
 * Textos de la web. Datos de la tarjeta The Horse in Motion (1878), de Wikipedia (artículos The Horse in Motion,
 * Eadweard Muybridge y Zoopraxiscope) y de las fichas de Wikimedia Commons de cada imagen.
 */

export const IMG = imagenes;
const BASE = import.meta.env.BASE_URL;
export const url = (ruta: string) => `${BASE}img/${ruta}`;
export const pad = (n: number) => String(n).padStart(2, '0');
export const commons = (fichero: string) => `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fichero.replace(/ /g, '_'))}`;

export const portada = {
  antetitulo: 'Palo Alto, California · 19 de junio de 1878',
  titulo: 'Muybridge',
  subtitulo: 'fotograma a fotograma',
  entradilla:
    'Doce cámaras en fila junto a una pista pintada de blanco. La yegua Sallie Gardner pasa al galope, rompe los hilos tendidos a su paso y cada hilo dispara un obturador. Aquí el scroll hace de pista: baja y la verás pasar.',
  pista: 'Baja despacio',
  hud: [
    {id: 'camara', etiqueta: 'Cámara'},
    {id: 'tiempo', etiqueta: 'Tiempo'},
    {id: 'distancia', etiqueta: 'Recorrido'},
  ],
  datosTarjeta: [
    {cifra: '12', texto: 'cámaras, una cada 27 pulgadas (69 cm)'},
    {cifra: '1/25 s', texto: 'entre una foto y la siguiente'},
    {cifra: '< 1/2000 s', texto: 'de exposición por foto'},
    {cifra: '≈ 60 km/h', texto: 'la velocidad de la yegua, sacada de esas dos cifras'},
  ],
  proyector: 'Doce fotos seguidas son medio segundo de galope. Puestas una detrás de otra, la yegua corre.',
  tarjeta:
    'La tarjeta que Muybridge vendió ese verano a 1,50 dólares. El cuadro 12 es la yegua parada, para comparar. Los datos de las cifras de arriba están impresos al pie.',
};

export const pregunta = {
  antetitulo: 'La pregunta',
  titulo: '¿Despega las cuatro patas a la vez?',
  cuadro:
    'Así pintaba casi todo el mundo un caballo al galope: las patas de delante estiradas hacia delante, las de detrás hacia atrás y el cuerpo en el aire. Es El Derby de Epsom, de Théodore Géricault (1821).',
  stanford:
    'Leland Stanford, magnate del ferrocarril y criador de caballos, estaba seguro de que eso era falso y pagó a Muybridge para demostrarlo. Se cuenta que apostó 25.000 dólares; no se ha encontrado ningún documento de esa apuesta.',
  lamina:
    'Lámina 626 de Animal Locomotion (1887): la yegua Annie G. al galope, en 15 fotos. Baja despacio y para cuando no toque el suelo.',
  aire: 'Las cuatro en el aire',
  respuesta: 'Sí despega. Pero no como en el cuadro.',
  explicacion:
    'Las cuatro patas dejan el suelo cuando van recogidas bajo el cuerpo, justo cuando el caballo pasa de tirar con las patas delanteras a empujar con las traseras. Con las patas estiradas, como las pintó Géricault, siempre hay al menos una apoyada.',
  nope: 'El jinete de esta lámina no tiene nombre conocido. La película Nope (2022), de Jordan Peele, se inventa a sus descendientes.',
  comparar: ['Géricault, 1821', 'Muybridge, 1887'],
};

export const disco = {
  antetitulo: 'El zoopraxiscopio',
  titulo: 'Un disco que gira a saltos',
  cuerpo:
    'En 1880 Muybridge proyectó sus series en movimiento con un aparato propio, el zoopraxiscopio. Las siluetas se pintaban sobre discos de cristal de 16 pulgadas que giraban delante de la lámpara. El truco está en no ver el giro: el aparato tapa la luz entre dibujo y dibujo y el ojo junta los saltos en un movimiento.',
  scroll: 'Aquí el scroll gira el disco a saltos, como el aparato. A la izquierda, el disco entero; a la derecha, lo que veía el público.',
  fuente:
    'Discos reproducidos en su libro Descriptive Zoopraxography (1893), con dibujos calcados de sus fotos.',
  animales: [
    {id: 'galgo', nombre: 'Galgo', paso: 'al galope', nota: 'El galgo vuela dos veces en cada zancada: una con el cuerpo estirado y otra encogido. El caballo, una sola.'},
    {id: 'bisonte', nombre: 'Bisonte', paso: 'al galope', nota: 'Los animales salvajes los fotografió en el zoo de Filadelfia.'},
    {id: 'alce', nombre: 'Alce', paso: 'al galope', nota: 'Trece dibujos por vuelta: el animal avanza un poco en cada salto del disco.'},
    {id: 'leon', nombre: 'León', paso: 'al paso', nota: 'Al paso, el movimiento es tan lento que se puede seguir pata a pata.'},
    {id: 'elefante', nombre: 'Elefante', paso: 'en ambladura', nota: 'El elefante no galopa: por rápido que vaya, siempre tiene al menos una pata en el suelo.'},
    {id: 'palomas', nombre: 'Palomas', paso: 'en vuelo', nota: 'Doce dibujos de un aleteo. En 1880 nadie había visto un ala en esas posiciones.'},
  ],
};

export const legado = {
  antetitulo: 'Después de la yegua',
  titulo: '781 láminas',
  cuerpo:
    'Entre 1883 y 1886, en la Universidad de Pensilvania, Muybridge hizo más de 100.000 fotos de animales y personas en movimiento. Las publicó en 1887 en Animal Locomotion: 781 láminas que los pintores usaron durante décadas como modelo.',
  cifras: [
    {cifra: 12, texto: 'cámaras en 1878'},
    {cifra: 24, texto: 'cámaras en 1879'},
    {cifra: 781, texto: 'láminas en 1887'},
    {cifra: 71, texto: 'discos del zoopraxiscopio conservados'},
  ],
  hitos: [
    {ano: '1879', texto: 'Pasa a 24 cámaras y fotografía hasta el esqueleto de un caballo saltando una valla, montado pose a pose.'},
    {ano: '1880', texto: 'Primera proyección del zoopraxiscopio, en San Francisco.'},
    {ano: '1887', texto: 'Animal Locomotion: 781 láminas.'},
    {ano: 'Después', texto: 'Muybridge se reúne con Thomas Edison, que después desarrolla el kinetógrafo, una de las primeras cámaras de cine.'},
    {ano: '1912', texto: 'Marcel Duchamp pinta Desnudo bajando una escalera n.º 2, inspirado en estas series.'},
  ],
  pie: 'Muybridge murió en 1904 en Kingston upon Thames, donde había nacido. El museo de la ciudad guarda su zoopraxiscopio y sus discos.',
};

export const creditos = {
  titulo: 'Fuentes',
  fuentes: [
    {nombre: 'Wikimedia Commons: Eadweard Muybridge', url: 'https://commons.wikimedia.org/wiki/Category:Eadweard_Muybridge'},
    {nombre: 'Wikipedia: The Horse in Motion', url: 'https://en.wikipedia.org/wiki/The_Horse_in_Motion'},
    {nombre: 'Wikipedia: Eadweard Muybridge', url: 'https://en.wikipedia.org/wiki/Eadweard_Muybridge'},
    {nombre: 'Wikipedia: Zoopraxiscope', url: 'https://en.wikipedia.org/wiki/Zoopraxiscope'},
  ],
  imagenes: [
    {fichero: 'The Horse in Motion high res.jpg', texto: 'The Horse in Motion, Sallie Gardner (1878)'},
    {fichero: 'Muybridge race horse animated.gif', texto: 'Animal Locomotion, lámina 626, Annie G. (1887; animación de Waugsberg)'},
    {fichero: 'Le Derby de 1821 à Epsom - Théodore Géricault - Musée du Louvre Peintures MI 708.jpg', texto: 'Théodore Géricault, El Derby de Epsom (1821), Museo del Louvre'},
    {fichero: 'Descriptive Zoopraxography Greyhound Galloping.jpg', texto: 'Descriptive Zoopraxography (1893): discos del galgo, el bisonte, el alce, el león, el elefante y las palomas'},
    {fichero: 'Animal locomotion. Plate 563 (Boston Public Library).jpg', texto: 'Animal Locomotion, láminas 563 y 709 (Boston Public Library)'},
    {fichero: 'Eadweard Muybridge - Animal Locomotion, Plate 686 - Google Art Project.jpg', texto: 'Animal Locomotion, láminas 686 y 712 (Google Art Project)'},
  ],
  metodo:
    'Web hecha con ayuda de IA (Claude). Las fotos y los dibujos son de dominio público y no se han generado ni retocado con IA: solo se han recortado, girado y ordenado. El sentido de giro de los discos se comprobó contra las animaciones de Commons.',
  firma: 'Baja otra vez: la yegua vuelve a correr.',
};
