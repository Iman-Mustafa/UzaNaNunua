import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, role, password } = body;

    if (!name || !phone || !role || !password) {
      return NextResponse.json(
        { message: 'All fields (Name, Phone, Role, Password) are required.' },
        { status: 400 }
      );
    }

    if (!['Seller', 'Buyer'].includes(role)) {
      return NextResponse.json(
        { message: 'Invalid role selected.' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this phone number already exists.' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      phone,
      role,
      password,
    });

    return NextResponse.json(
      {
        message: 'Account created successfully!',
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: error.message || 'Server error during signup' },
      { status: 500 }
    );
  }
}
