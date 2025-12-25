import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(missions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, category, xpReward, tools } = body;

    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        category,
        status: 'PENDING',
        xpReward: Number(xpReward) || 10,
        tools: tools || [],
      },
    });

    return NextResponse.json(mission);
  } catch (error) {
    console.error('Mission create error:', error);
    return NextResponse.json({ error: 'Failed to create mission' }, { status: 500 });
  }
}
