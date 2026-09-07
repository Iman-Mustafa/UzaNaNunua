import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const identifier = String(body.name || body.phone || body.identifier || '').trim();
    const password = String(body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: 'Please provide both Name/Phone Number and Password.' },
        { status: 400 }
      );
    }

    // Safely escape special characters for regex (e.g. '+' in '+255...')
    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedInput = escapeRegex(identifier);

    // Extract digits to support phone matching across different formats (e.g., 0712... vs +255712...)
    const digitsOnly = identifier.replace(/\D/g, '');

    const orConditions: any[] = [
      // Case-insensitive name match allowing optional whitespace
      { name: { $regex: new RegExp(`^\\s*${escapedInput}\\s*$`, 'i') } },
      // Direct phone match
      { phone: identifier },
      { phone: { $regex: new RegExp(`^\\s*${escapedInput}\\s*$`, 'i') } },
    ];

    // If identifier has at least 6 digits, match against last 9 digits (handles country code variants)
    if (digitsOnly.length >= 6) {
      const matchSuffix = digitsOnly.slice(-9);
      orConditions.push({ phone: { $regex: new RegExp(escapeRegex(matchSuffix)) } });
    }

    const matchingUsers = await User.find({ $or: orConditions });

    if (!matchingUsers || matchingUsers.length === 0) {
      return NextResponse.json(
        { message: 'No account found with that name or phone number. Please check your details or sign up.' },
        { status: 401 }
      );
    }

    // Check if any matching user account has the matching password
    const user = matchingUsers.find((u) => {
      const uPass = String(u.password || '').trim();
      return uPass === password;
    });

    if (!user) {
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
