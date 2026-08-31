import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const countInStock = formData.get('countInStock') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name || !price || !description || !category || !countInStock) {
      return NextResponse.json(
        { message: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    if (!imageFile || !(imageFile instanceof Blob)) {
      return NextResponse.json(
        { message: 'Product image is required' },
        { status: 400 }
      );
    }

    // Convert file to Buffer for Cloudinary upload
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadRes = await uploadImageToCloudinary(buffer);

    const product = new Product({
      name,
      price: parseFloat(price),
      description,
      image: uploadRes.secure_url,
      category,
      countInStock: parseInt(countInStock, 10),
    });

    const createdProduct = await product.save();

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
