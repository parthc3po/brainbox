import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const arts = await prisma.art.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(arts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const art = await prisma.art.create({
      data: {
        title: body.title,
        data: body.data,
        author: body.author || 'Artist'
      }
    });
    return NextResponse.json(art);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
