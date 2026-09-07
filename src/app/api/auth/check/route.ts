import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  try {
    await connectDB();

    if (!name) {
      // Just test DB connection + count users
      const count = await User.countDocuments();
      return NextResponse.json({ ok: true, dbConnected: true, totalUsers: count });
    }

    const user = await User.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (!user) {
      return NextResponse.json({ ok: false, found: false, message: 'No user found with that name' });
    }

    return NextResponse.json({
      ok: true,
      found: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        hasPassword: !!user.password,
        passwordLength: user.password?.length ?? 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, dbConnected: false, error: error.message },
      { status: 500 }
    );
  }
}
