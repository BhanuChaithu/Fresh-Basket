import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/store';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('category') || undefined;
    const isFeatured = searchParams.get('featured') === 'true' ? true : undefined;
    const search = searchParams.get('search') || undefined;
    const includeUnavailable = searchParams.get('includeUnavailable') === 'true';

    const products = await getProducts({
      categoryId,
      isFeatured,
      search,
      includeUnavailable,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || body.current_price === undefined) {
      return NextResponse.json(
        { error: 'Product name and current price are required' },
        { status: 400 }
      );
    }

    const newProduct = await saveProduct(body);
    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}
