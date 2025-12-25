import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const chores = await prisma.chore.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(chores);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const chore = await prisma.chore.create({
      data: {
        title: body.title,
        xpReward: parseInt(body.xpReward),
        status: 'PENDING',
        assignedTo: body.assignedTo || 'Kid'
      }
    });
    return NextResponse.json(chore);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const updated = await prisma.chore.update({
      where: { id: body.id },
      data: { status: body.status }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
