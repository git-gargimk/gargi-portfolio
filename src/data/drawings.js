const image = filename => `${import.meta.env.BASE_URL}images/drawings/${filename}`;

export const drawings = [
  {
    id: 'sunflower',
    src: image('sunflower.jpeg'),
    title: 'Sunflower',
    alt: 'Black ink sunflower drawing with layered, finely shaded petals and a textured circular center on a spiral sketchbook page.',
    width: 1284,
    height: 1498,
  },
  {
    id: 'mandala-patterns',
    src: image('mandala-patterns.jpeg'),
    title: 'Mandala patterns',
    alt: 'A sketchbook page filled with overlapping black ink mandalas, intricate floral shapes, scalloped borders, and repeating leaf patterns.',
    width: 1130,
    height: 1398,
  },
  {
    id: 'floral-mandala',
    src: image('floral-mandala.jpeg'),
    title: 'Floral mandala',
    alt: 'A circular black ink mandala with a delicate floral center surrounded by layered petals, paisley details, and bold repeating patterns.',
    width: 1142,
    height: 1488,
  },
  {
    id: 'puppy',
    src: image('puppy.jpeg'),
    title: 'Puppy portrait',
    alt: 'Pencil portrait of a puppy with floppy ears, large expressive eyes, a dark nose, and softly shaded, textured fur.',
    width: 1130,
    height: 1514,
  },
  {
    id: 'owl',
    src: image('owl.jpeg'),
    title: 'Owl study',
    alt: 'Pencil drawing of an owl facing forward, with prominent ear tufts, watchful eyes, and detailed patterns across its feathers.',
    width: 1272,
    height: 1492,
  },
  {
    id: 'bird-on-branch',
    src: image('bird-on-branch.jpeg'),
    title: 'Bird on a branch',
    alt: 'Pencil drawing of a crested bird perched on a leafy branch, with patterned wings and a long striped tail.',
    width: 1090,
    height: 1352,
  },
];
