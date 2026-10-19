import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { getProductById, getProducts, getSettings } from '@/lib/store';
import ProductDetailClient from './ProductDetailClient';
import ProductCard from '@/components/ProductCard';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, settings] = await Promise.all([
    getProductById(id),
    getSettings(),
  ]);

  if (!product) {
    notFound();
  }

  // Fetch related products from the same category
  const allRelated = await getProducts({
    categoryId: product.category_id,
    includeUnavailable: false,
  });
  const related = allRelated.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#218838]">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#218838]">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/shop?category=${product.category_id}`}
          className="hover:text-[#218838]"
        >
          {product.category_name || 'Category'}
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </div>

      {/* Main Product Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Image & Badges */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-white border border-gray-200/80 shadow-md relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
            />
            {product.is_sample_data && (
              <span className="absolute top-4 left-4 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-1 rounded-md shadow-xs">
                Sample Test Produce
              </span>
            )}
            {!product.is_available && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                <span className="bg-red-600 text-white font-black text-sm px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Sourcing & Storage Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {product.origin && (
              <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#218838] shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Origin</span>
                  <span className="font-bold text-gray-800">{product.origin}</span>
                </div>
              </div>
            )}
            {product.storage_notes && (
              <div className="p-3 bg-white rounded-xl border border-gray-200 flex items-center gap-2.5">
                <Info className="w-4 h-4 text-[#FFC928] shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Storage</span>
                  <span className="font-medium text-gray-700 truncate block">{product.storage_notes}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <ProductDetailClient product={product} settings={settings} />

          {/* Delivery & Trust Highlights */}
          <div className="p-5 bg-white rounded-2xl border border-gray-200 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
              Fresh Basket Bengaluru Delivery Guarantee
            </h4>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#218838] shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Warehouse Storage:</strong> Harvested and consolidated directly from farmers to fulfill your order.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#218838] shrink-0 mt-0.5" />
                <span>
                  <strong>Flexible Slots:</strong> Morning (7 AM - 10 AM) & Evening (4 PM - 7 PM). Cutoff 9 PM for morning harvest.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#218838] shrink-0 mt-0.5" />
                <span>
                  <strong>Inspect at Door:</strong> Pay via Cash on Delivery or UPI after inspecting your produce.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Produce Section */}
      {related.length > 0 && (
        <section className="pt-8 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900">
              More Fresh {product.category_name || 'Produce'}
            </h3>
            <Link
              href={`/shop?category=${product.category_id}`}
              className="text-xs font-bold text-[#218838] hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
