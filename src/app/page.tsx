import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Heart,
  ChevronRight,
  Leaf,
  Sun,
  Layers,
  MapPin,
} from 'lucide-react';
import { getProducts, getCategories, getSettings } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts({ includeUnavailable: false }),
    getCategories(),
    getSettings(),
  ]);

  const featuredVegetables = products.filter((p) => p.category_id === 'cat-veg').slice(0, 4);
  const featuredFruits = products.filter((p) => p.category_id === 'cat-fruits').slice(0, 4);
  const vegBaskets = products.filter((p) => p.category_id === 'cat-veg-baskets');
  const fruitBaskets = products.filter((p) => p.category_id === 'cat-fruit-baskets');
  const microgreens = products.filter((p) => p.category_id === 'cat-microgreens');

  const whatsappHeroUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    'Hi Fresh Basket! I would like to order fresh farm produce for delivery in Bengaluru.'
  )}`;

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#14532D] via-[#1a6237] to-[#218838] text-white pt-10 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FFC928]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FFC928] border border-white/20">
                <Sparkles className="w-4 h-4 text-[#FFC928]" />
                <span>Farm Fresh • Zero Cold Storage • Bengaluru Delivery</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
                Fresh Vegetables & Fruits,{' '}
                <span className="text-[#FFC928] underline decoration-[#FFC928]/50 decoration-wavy">
                  Delivered to Your Door.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Shop everyday produce at transparent prices. Place your order online or through WhatsApp.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FFC928] hover:bg-[#e6b422] text-[#14532D] px-7 py-4 rounded-2xl font-black text-base shadow-lg shadow-amber-900/30 transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5 text-[#14532D]" />
                  <span>Shop Fresh Produce</span>
                  <ArrowRight className="w-4 h-4 text-[#14532D]" />
                </Link>

                <a
                  href={whatsappHeroUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-4 rounded-2xl font-bold text-base backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Micro Trust Proof */}
              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-emerald-700/60 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#FFC928]">₹0</div>
                  <div className="text-[11px] text-emerald-100">Hidden Markups</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#FFC928]">₹299+</div>
                  <div className="text-[11px] text-emerald-100">Free Bengaluru Delivery</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#FFC928]">100%</div>
                  <div className="text-[11px] text-emerald-100">Pre-Order Freshness</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual / Highlight Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl p-6 shadow-2xl">
                {/* Visual badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#FFC928] text-[#14532D] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    Today&apos;s Farm Highlights
                  </span>
                  <span className="text-xs text-emerald-100 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC928]" /> Kolar & Hoskote
                  </span>
                </div>

                <div className="aspect-4/3 rounded-2xl overflow-hidden relative mb-4 shadow-md bg-emerald-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                    alt="Fresh Harvest Basket"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                    <div className="text-white">
                      <span className="text-[10px] font-bold text-[#FFC928] uppercase">Best Value Weekly Combo</span>
                      <h4 className="font-bold text-sm">Essential Veggie Basket (8.5 kg)</h4>
                      <p className="text-xs text-gray-200">Only ₹399 • 8 Essential Farm Veggies</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/15 rounded-xl p-3 text-xs text-emerald-50 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-white">Next Slot Cut-off</span>
                    <span>Order by 9:00 PM for morning delivery</span>
                  </div>
                  <Link
                    href="/shop?category=cat-veg-baskets"
                    className="bg-[#218838] hover:bg-[#1a6f2d] text-white px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 transition-colors"
                  >
                    View Combos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-[#218838] uppercase tracking-wider">
              Browse Catalogue
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Shop by Produce Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-bold text-[#218838] hover:text-[#14532D] flex items-center gap-1 group"
          >
            <span>View All Produce</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="group bg-white rounded-2xl p-4 border border-gray-200/80 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2.5"
            >
              <div className="w-13 h-13 rounded-2xl bg-[#F7FAF5] group-hover:bg-emerald-100 text-[#218838] flex items-center justify-center text-2xl transition-colors shadow-2xs">
                {cat.slug === 'vegetables' && '🥕'}
                {cat.slug === 'fruits' && '🍎'}
                {cat.slug === 'leafy-vegetables' && '🥬'}
                {cat.slug === 'vegetable-baskets' && '🧺'}
                {cat.slug === 'fruit-baskets' && '🍉'}
                {cat.slug === 'microgreens' && '🌱'}
                {cat.slug === 'seasonal-produce' && '🌞'}
              </div>
              <h3 className="font-bold text-xs text-gray-900 group-hover:text-[#218838] transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED VEGETABLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#218838] uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-[#218838]" /> Daily Staples
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Fresh Everyday Vegetables
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Procured from Hoskote, Kolar, and Nilgiris grower clusters at transparent ₹/kg prices.
            </p>
          </div>
          <Link
            href="/shop?category=cat-veg"
            className="text-sm font-bold text-[#218838] hover:text-[#14532D] flex items-center gap-1 group"
          >
            <span>See all vegetables</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredVegetables.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. VEGETABLE & FRUIT BASKETS SPOTLIGHT */}
      <section className="bg-gradient-to-tr from-emerald-900 to-[#14532D] text-white py-14 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
          <span className="bg-[#FFC928] text-[#14532D] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            Best Value Combo Baskets
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Curated Weekly Produce Baskets
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl mx-auto">
            Take the hassle out of everyday grocery shopping. Pre-portioned family baskets packed in eco-friendly breathable bags.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...vegBaskets, ...fruitBaskets].map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-xl text-gray-900 flex flex-col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED FRUITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-[#218838] uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5 text-[#FFC928]" /> Naturally Ripened
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Farm Sweet Fresh Fruits
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Sweet, aromatic, and free from harmful carbide ripening chemicals.
            </p>
          </div>
          <Link
            href="/shop?category=cat-fruits"
            className="text-sm font-bold text-[#218838] hover:text-[#14532D] flex items-center gap-1 group"
          >
            <span>See all fruits</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredFruits.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. HYDROPONIC MICROGREENS SECTION */}
      {microgreens.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="bg-[#218838] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  Nutrient Powerhouses
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Hydroponic Live Microgreens
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Grown in controlled Bengaluru urban hydroponic beds. Packed with up to 40x the vitamins, antioxidants, and minerals of mature vegetables. Perfect for salads, parathas, juices, and gourmet garnishing.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop?category=cat-microgreens"
                    className="inline-flex items-center gap-2 bg-[#218838] hover:bg-[#1a6f2d] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
                  >
                    <span>Explore Microgreens</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                {microgreens.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#218838] uppercase tracking-wider">
            Lean & Direct
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            How Fresh Basket Works
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            No expensive warehouses. No spoiled cold-storage vegetables. Just honest farm produce harvested against orders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#218838] flex items-center justify-center font-black text-lg mb-4">
              01
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-2">Order or Pre-Order</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Place your basket order online or over WhatsApp before 9:00 PM for the morning harvest slot.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg mb-4">
              02
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-2">Dawn Farm Harvest</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our partner farmers harvest vegetables and pick fruits at dawn based precisely on total customer orders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#218838] flex items-center justify-center font-black text-lg mb-4">
              03
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-2">Quality Grading</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Each item is sorted, weighed, and packed into breathable paper and jute bags to preserve crispness.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-2xs relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg mb-4">
              04
            </div>
            <h4 className="font-bold text-base text-gray-900 mb-2">Delivered to Door</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct delivery to your doorstep in your chosen Bengaluru slot. Pay with Cash or UPI after checking produce!
            </p>
          </div>
        </div>
      </section>

      {/* 8. DELIVERY INFORMATION & SLOTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#218838] uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#218838]" /> Bengaluru Service Zones
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                Reliable Delivery in Your Neighbourhood
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We currently deliver to HSR Layout, Koramangala, Indiranagar, BTM Layout, Jayanagar, JP Nagar, Bellandur, Whitefield, and Sarjapur Road.
              </p>
              <div className="pt-2">
                <Link
                  href="/delivery-policy"
                  className="text-xs font-bold text-[#218838] hover:underline inline-flex items-center gap-1"
                >
                  <span>Read full delivery schedule & PIN policy</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#F7FAF5] border border-gray-200/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#218838] flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-gray-900">Morning Slot (7 AM - 10 AM)</h5>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Best for morning cooking. Place your order before 9:00 PM previous evening.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7FAF5] border border-gray-200/80">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Sun className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-gray-900">Evening Slot (4 PM - 7 PM)</h5>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Afternoon consolidation for dinner preparations. Cut-off 12:00 PM noon.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7FAF5] border border-gray-200/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#218838] flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-gray-900">
                  {settings.free_delivery_threshold === 0 ? '100% Free Delivery' : 'Free Delivery Threshold'}
                </h5>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {settings.free_delivery_threshold === 0
                    ? 'Free delivery (₹0 delivery charge) across all active Bengaluru delivery PIN codes!'
                    : `Free delivery across all active Bengaluru PINs on all orders above ₹${settings.free_delivery_threshold}.`}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7FAF5] border border-gray-200/80">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-gray-900">Payment at Doorstep</h5>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Inspect your vegetables first. Pay with Cash on Delivery or scan UPI QR directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#218838] uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#218838] shrink-0" />
              How do you keep prices honest and competitive?
            </h4>
            <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
              We operate with ₹0 expensive overheads—no high-rent physical cold stores, no paid venture ad budgets, and zero subscription costs. We consolidate daily orders and source directly from Bengaluru farm belts, passing the savings straight to your home.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#218838] shrink-0" />
              Can I place my entire order through WhatsApp?
            </h4>
            <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
              Yes, absolutely! You can either build your basket on the website and click &quot;Send Cart to WhatsApp&quot;, or simply message our WhatsApp number directly with your grocery list. Our team verifies stock and confirms your delivery slot.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#218838] shrink-0" />
              What if a vegetable or fruit does not meet my quality expectations?
            </h4>
            <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
              We stand by our produce. Because you inspect items upon delivery, you can reject any substandard item on the spot with zero hassle and deduct it from your Cash on Delivery or UPI payment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-2xs">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#218838] shrink-0" />
              What are the delivery slots and cut-off timings?
            </h4>
            <p className="text-xs text-gray-600 mt-2 pl-6 leading-relaxed">
              Morning deliveries (7 AM – 10 AM) require orders before 9 PM the previous day so our growers can harvest at dawn. Evening slots (4 PM – 7 PM) accept orders placed before 12 PM noon on the same day.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/faq"
            className="text-xs font-bold text-[#218838] hover:underline inline-flex items-center gap-1"
          >
            <span>View all FAQs & policies</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 10. WHATSAPP CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#14532D] to-[#218838] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-[#FFC928] text-[#14532D] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              Quick & Easy Grocery Ordering
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Prefer to order via WhatsApp?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-lg">
              Send us your grocery list or ask questions about today&apos;s harvest. We reply with itemized prices and confirm your delivery.
            </p>
          </div>

          <a
            href={whatsappHeroUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span>Chat on WhatsApp: {settings.display_phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
}
