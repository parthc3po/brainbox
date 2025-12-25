const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const TOPICS = [
  {
    title: "Black Holes",
    category: "Space",
    slug: "black-holes",
    content: "# Black Holes\nA black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it.\n\n## Event Horizon\nThe boundary of the region from which no escape is possible is called the event horizon.\n\n## Spaghettification\nIf you fell into a black hole, you would be stretched out like spaghetti!"
  },
  {
    title: "The Mariana Trench",
    category: "Deep Sea",
    slug: "mariana-trench",
    content: "# The Mariana Trench\nLocated in the western Pacific Ocean, the Mariana Trench is the deepest oceanic trench on Earth.\n\n## Challenger Deep\nThe deepest point is known as the Challenger Deep, reaching approximately 10,984 meters (36,037 ft).\n\n## Life Down There\nDespite the pressure, life exists! Amphipods and sea cucumbers thrive in the dark."
  },
  {
    title: "Ada Lovelace",
    category: "Coding",
    slug: "ada-lovelace",
    content: "# Ada Lovelace\nAugusta Ada King, Countess of Lovelace, was an English mathematician and writer.\n\n## First Programmer\nShe is chiefly known for her work on Charles Babbage's proposed mechanical general-purpose computer, the Analytical Engine. She recognized that the machine had applications beyond pure calculation."
  },
  {
    title: "The Antikythera Mechanism",
    category: "History",
    slug: "antikythera-mechanism",
    content: "# The Antikythera Mechanism\nAn ancient Greek hand-powered orrery, described as the oldest example of an analogue computer.\n\n## Discovery\nFound in a shipwreck off the coast of the Greek island Antikythera in 1901.\n\n## Purpose\nIt was used to predict astronomical positions and eclipses for calendar and astrological purposes."
  }
];

async function main() {
  console.log('Start seeding knowledge...');
  for (const t of TOPICS) {
    const exists = await prisma.topic.findUnique({ where: { slug: t.slug } });
    if (!exists) {
      await prisma.topic.create({ data: t });
      console.log(`Created topic: ${t.title}`);
    }
  }
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
