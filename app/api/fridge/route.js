import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const shouts = await prisma.shout.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });
    return NextResponse.json(shouts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const shout = await prisma.shout.create({
      data: {
        message: body.message,
        author: body.author,
        color: body.color
      }
    });
    return NextResponse.json(shout);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
