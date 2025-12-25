import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const { status } = body;

    const mission = await prisma.mission.update({
      where: { id },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });

    // Gamification Logic
    if (status === 'COMPLETED') {
      const stats = await prisma.userStats.findFirst();
      if (stats) {
        await prisma.userStats.update({
          where: { id: stats.id },
          data: {
            totalXp: { increment: mission.xpReward || 10 },
            missionsDone: { increment: 1 }
          }
        });
      }
    }

    return NextResponse.json(mission);
  } catch (error) {
    console.error('Mission update error:', error);
    return NextResponse.json({ error: 'Failed to update mission' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    await prisma.mission.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete mission' }, { status: 500 });
  }
}
