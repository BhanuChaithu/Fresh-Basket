import React from 'react';
import { Check, Clock, AlertTriangle, PackageCheck, Truck, CheckCircle2 } from 'lucide-react';
import { OrderStatus } from '@/lib/types';

const STEPS: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: 'Pending confirmation',
    label: 'Order Placed',
    description: 'We received your order and are checking harvest allocation.',
  },
  {
    status: 'Confirmed',
    label: 'Confirmed',
    description: 'Order confirmed with partner growers.',
  },
  {
    status: 'Awaiting procurement',
    label: 'Awaiting Harvest',
    description: 'Fresh vegetables and fruits being gathered from growers.',
  },
  {
    status: 'Preparing',
    label: 'Grading & Packing',
    description: 'Produce sorted, weighed, and packed in breathable bags.',
  },
  {
    status: 'Out for delivery',
    label: 'Out for Delivery',
    description: 'Delivery executive on the way to your Bengaluru address.',
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    description: 'Handed over at your doorstep. Enjoy farm freshness!',
  },
];

export default function OrderStatusTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
        <div>
          <span className="font-bold text-sm block">Order Cancelled</span>
          <span>This order has been cancelled. If you have questions, please reach out via WhatsApp.</span>
        </div>
      </div>
    );
  }

  // Find index of current status
  let activeIndex = STEPS.findIndex((s) => s.status === currentStatus);
  if (activeIndex === -1) {
    if (currentStatus === 'Ready for dispatch') activeIndex = 3;
    else activeIndex = 0;
  }

  return (
    <div className="py-2">
      <div className="relative">
        {/* Horizontal bar for desktop */}
        <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-gray-200 -z-0">
          <div
            className="bg-[#218838] h-full transition-all duration-500"
            style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:gap-2 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={step.status} className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-left sm:text-center">
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors shadow-xs ${
                    isCompleted
                      ? 'bg-[#218838] text-white'
                      : isCurrent
                      ? 'bg-[#FFC928] text-[#14532D] ring-4 ring-emerald-100'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div>
                  <h5
                    className={`font-bold text-xs ${
                      isCurrent
                        ? 'text-[#14532D]'
                        : isCompleted
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </h5>
                  <p className="text-[10px] text-gray-500 sm:hidden mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
