import type { Feature } from "$lib/utils/types";

export default [ 
  {
    name: 'Eficiencia Energética',
    description:
      'Maximización de la generación de energía con recursos limitados.',
    image: 'images/features/solar4.jpeg',
    tags: [{ label: 'Powered by MDsveX' }]
  }, 
  {
    name: 'Minimización de Costos',
    description:
      'Reducción de costos operativos y de inversión mediante decisiones óptimas.',
    image: 'images/features/solar5.jpeg',
    tags: [{ label: 'Primary Color' }, { label: 'Secondary Color', color: 'secondary' }]
  }, 
  {
    name: 'Sustentabilidad',
    description:
      'Optimización del uso de materiales, reduciendo el impacto ambiental.',
    image: 'images/features/solar6.jpeg',
  }, 
  {
    name: 'Menos uso de combustibles',
    description:
      'Disminuye la necesidad del uso de combustibles fósiles.',
    image: 'images/features/solar7.jpeg',
    tags: [{ label: 'Powered by Image Transmutation' }]
  }, 
  {
    name: 'Reduce la huella de carbono',
    description:
      'Menos dependencia de fuentes de energía no renovables.',
    image: 'images/features/solar8.jpeg',
  },
  {
    name: 'Es renovable y sostenible',
    description:
      'El uso de paneles solares se puede aprovechar en cualquier lugar.',
    image: 'images/features/solar9.jpeg'
  },
] as Feature[];