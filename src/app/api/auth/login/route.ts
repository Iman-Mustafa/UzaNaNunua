import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, password } = body;

    if (!name || !password) {
      return NextResponse.json(
        { message: 'Please provide both Name and Password.' },
        { status: 400 }
      );
    }

    // Find user by name (case-insensitive)
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid name or password.' },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid name or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Login successful!',
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { message: error.message || 'Server error during login' },
      { status: 500 }
    );
  }
}
