import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Prevent static generation - this route requires database
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const secrets = await prisma.secret.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(secrets);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, encryptedContent } = body;
    const secret = await prisma.secret.create({
      data: { title, encryptedContent }
    });
    return NextResponse.json(secret);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request) {
  // To be implemented or handled via ID route
  return NextResponse.json({ success: true });
}
