import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: { options: true },
      where: { active: true }
    });
    return NextResponse.json(polls);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Complex create with nested relation
    const poll = await prisma.poll.create({
      data: {
        question: body.question,
        options: {
          create: body.options.map(text => ({ text }))
        }
      },
      include: { options: true }
    });
    return NextResponse.json(poll);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    // Vote for an option
    const option = await prisma.pollOption.update({
      where: { id: body.optionId },
      data: { votes: { increment: 1 } }
    });
    return NextResponse.json(option);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
