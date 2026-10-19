import React from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/store';
import ProductCard from '@/components/ProductCard';
import { Filter, Search, Sparkles } from 'lucide-react';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const { category, search, sort } = await searchParams;

  const [allProducts, categories] = await Promise.all([
    getProducts({ includeUnavailable: true }),
    getCategories(),
  ]);

  let filtered = [...allProducts];

  // Category filter
  if (category) {
    filtered = filtered.filter((p) => p.category_id === category);
  }

  // Search filter
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        (p.category_name && p.category_name.toLowerCase().includes(s)) ||
        (p.origin && p.origin.toLowerCase().includes(s))
    );
  }

  // Sort
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.current_price - b.current_price);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.current_price - a.current_price);
  } else if (sort === 'name-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const selectedCategory = categories.find((c) => c.id === category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#218838]">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">
            {selectedCategory ? selectedCategory.name : 'All Fresh Produce'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {selectedCategory ? selectedCategory.name : 'Farm Fresh Produce Catalogue'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {selectedCategory
                ? selectedCategory.description
                : 'Direct farm harvests from Bengaluru growers at transparent, honest prices.'}
            </p>
          </div>

          <div className="text-xs text-gray-500 font-semibold bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs self-start sm:self-auto">
            Showing <strong className="text-[#218838]">{filtered.length}</strong> items
          </div>
        </div>
      </div>

      {/* Category Pills & Search Bar */}
      <div className="space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              !category
                ? 'bg-[#218838] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Produce ({allProducts.length})
          </Link>

          {categories.map((cat) => {
            const count = allProducts.filter((p) => p.category_id === cat.id).length;
            const isActive = category === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#218838] text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <form method="GET" action="/shop" className="relative flex-1 w-full">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              type="text"
              name="search"
              defaultValue={search || ''}
              placeholder="Search produce by name, origin, or keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          {/* Sort selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 text-xs">
            <span className="text-gray-500 font-medium shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gray-400" /> Sort by:
            </span>
            <div className="flex gap-1 overflow-x-auto">
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(search ? { search } : {}),
                  sort: 'price-asc',
                }).toString()}`}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                  sort === 'price-asc'
                    ? 'bg-emerald-50 border-[#218838] text-[#14532D]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={`/shop?${new URLSearchParams({
                  ...(category ? { category } : {}),
                  ...(search ? { search } : {}),
                  sort: 'price-desc',
                }).toString()}`}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                  sort === 'price-desc'
                    ? 'bg-emerald-50 border-[#218838] text-[#14532D]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Price: High to Low
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#218838] flex items-center justify-center mx-auto text-2xl">
            🥦
          </div>
          <h3 className="font-bold text-lg text-gray-900">No matching produce found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search terms or view our all-produce catalogue.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="px-5 py-2.5 bg-[#218838] text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Clear All Filters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Lean transparency note */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#218838] shrink-0" />
          <span>
            <strong>Produce Pricing Guarantee:</strong> We do not hold old stock in cold stores. Prices update dynamically to reflect daily wholesale mandi and farm-gate rates.
          </span>
        </div>
      </div>
    </div>
  );
}
