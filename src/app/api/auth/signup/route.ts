import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, role, password } = body || {};
    const cleanName = String(name || '').trim();
    const cleanPhone = String(phone || '').trim();
    const cleanRole = String(role || '').trim();
    const cleanPassword = String(password || '').trim();

    if (!cleanName || !cleanPhone || !cleanRole || !cleanPassword) {
      return NextResponse.json(
        { message: 'All fields (Name, Phone, Role, Password) are required.' },
        { status: 400 }
      );
    }

    if (!['Seller', 'Buyer'].includes(cleanRole)) {
      return NextResponse.json(
        { message: 'Invalid role selected. Must be Seller or Buyer.' },
        { status: 400 }
      );
    }

    // Check if user already exists with same phone number
    const existingByPhone = await User.findOne({ phone: cleanPhone });
    if (existingByPhone) {
      return NextResponse.json(
        { message: 'An account with this phone number already exists. Please log in.' },
        { status: 400 }
      );
    }

    const userRole = (cleanRole.toLowerCase() === 'seller' ? 'Seller' : 'Buyer') as 'Seller' | 'Buyer';

    const user = await User.create({
      name: cleanName,
      phone: cleanPhone,
      role: userRole,
      password: cleanPassword,
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
