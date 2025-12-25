import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

// For this single-user app, we'll use a fixed ID or just get the first record
export async function GET() {
  try {
    let stats = await prisma.userStats.findFirst({
      include: { badges: true }
    });

    if (!stats
    ) {
      stats = await prisma.userStats.create({
        data: {
          totalXp: 0,
          level: 1,
          missionsDone: 0
        }
      });
    }

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
