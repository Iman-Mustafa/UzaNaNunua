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

    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    // Find user by name (case-insensitive, trimmed)
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'No account found with that name. Please check your name or sign up.' },
        { status: 401 }
      );
    }

    // Check password (plain text comparison, trimmed)
    if (!user.password || user.password.trim() !== trimmedPassword) {
      return NextResponse.json(
        { message: 'Incorrect password. Please try again.' },
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

    // Specific message if DB is not connected
    if (error.message?.includes('MONGO_URI') || error.message?.includes('connect')) {
      return NextResponse.json(
        { message: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: error.message || 'Server error during login' },
      { status: 500 }
    );
  }
}
