import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};
    const topics = await prisma.topic.findMany({ where, orderBy: { title: 'asc' } });

    return NextResponse.json(topics);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // slugify title if not provided
    const slug = body.slug || body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const topic = await prisma.topic.create({
      data: {
        title: body.title,
        category: body.category,
        content: body.content,
        slug
      }
    });
    return NextResponse.json(topic);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
