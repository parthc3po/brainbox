import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game');

    if (!game) return NextResponse.json([], { status: 400 });

    const topScores = await prisma.gameScore.findMany({
      where: { game },
      orderBy: { score: 'desc' },
      take: 10
    });

    return NextResponse.json(topScores);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { game, score, player } = body;

    const newScore = await prisma.gameScore.create({
      data: { game, score: parseInt(score), player: player || 'Hacker' }
    });

    return NextResponse.json(newScore);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
