import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const entry = await prisma.journalEntry.create({
      data: {
        title: body.title,
        content: body.content // Expecting encrypted string from client
      }
    });
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
