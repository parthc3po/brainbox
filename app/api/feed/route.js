import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

// Curated Fun/Science Feeds (Internal-friendly)
const DEFAULT_FEEDS = [
  { title: 'NASA Image of Day', url: 'https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss', category: 'Space' },
  { title: 'History Facts', url: 'https://www.history.com/.rss/full/this-day-in-history', category: 'History' },
];

export async function GET() {
  try {
    // 1. Fetch sources from DB
    let sources = await prisma.feedSource.findMany({ where: { enabled: true } });

    // If no sources, use defaults (and maybe save them later, but for now just use them)
    if (sources.length === 0) {
      sources = DEFAULT_FEEDS;
    }

    // 2. Fetch and parse all feeds in parallel
    const feedPromises = sources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return feed.items.map(item => ({
          title: item.title,
          link: item.link,
          content: item.contentSnippet || item.content,
          pubDate: item.pubDate,
          source: source.title,
          category: source.category,
        }));
      } catch (err) {
        console.error(`Failed to parse feed ${source.url}`, err);
        return [];
      }
    });

    const results = await Promise.all(feedPromises);

    // 3. Flatten and sort by date
    const allItems = results.flat().sort((a, b) => {
      return new Date(b.pubDate) - new Date(a.pubDate);
    });

    return NextResponse.json(allItems);
  } catch (error) {
    console.error('Feed API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, url, category } = body;
    const source = await prisma.feedSource.create({
      data: { title, url, category }
    });
    return NextResponse.json(source);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add source' }, { status: 500 });
  }
}
