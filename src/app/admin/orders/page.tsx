'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Package,
  MessageCircle,
  Edit2,
  AlertCircle,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';

const STATUS_LIST: OrderStatus[] = [
  'Pending confirmation',
  'Confirmed',
  'Awaiting procurement',
  'Preparing',
  'Ready for dispatch',
  'Out for delivery',
  'Delivered',
  'Cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdateMsg, setStatusUpdateMsg] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'All' ? '/api/orders' : `/api/orders?status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        if (selectedOrder) {
          const updatedSelected = data.orders.find((o: Order) => o.id === selectedOrder.id);
          if (updatedSelected) setSelectedOrder(updatedSelected);
        }
      }
    } catch {
      console.warn('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
        setStatusUpdateMsg(`Status updated to "${newStatus}" for order #${data.order.order_number}`);
        setTimeout(() => setStatusUpdateMsg(null), 3000);
      }
    } catch {
      alert('Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newPayStatus: PaymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: newPayStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch {
      alert('Failed to update payment status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(s) ||
      o.customer_name.toLowerCase().includes(s) ||
      o.customer_phone.includes(s) ||
      o.neighbourhood.toLowerCase().includes(s) ||
      o.pincode.includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Incoming Orders & Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitor and update live order fulfillment, farm harvest status, and doorstep deliveries.
          </p>
        </div>

        <div className="text-xs font-bold text-gray-600 bg-white px-3.5 py-2 rounded-xl border border-gray-200">
          Total: <strong className="text-[#218838]">{orders.length}</strong> orders
        </div>
      </div>

      {statusUpdateMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#218838] shrink-0" />
          <span>{statusUpdateMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        <button
          onClick={() => setStatusFilter('All')}
          className={`px-3 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
            statusFilter === 'All'
              ? 'bg-[#14532D] text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Orders ({orders.length})
        </button>
        {STATUS_LIST.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
              statusFilter === st
                ? 'bg-[#218838] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, Mobile, or PIN..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#218838]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Orders Grid / Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders List Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-400">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">No matching orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-3">Order</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Live Status</th>
                    <th className="py-3 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-gray-50/70'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <span className="font-bold text-gray-900 block">
                            #{order.order_number}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(order.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-semibold text-gray-900">{order.customer_name}</div>
                          <div className="text-gray-400 text-[11px]">{order.neighbourhood}</div>
                        </td>

                        <td className="py-3 px-3 font-black text-[#14532D]">
                          ₹{order.total_amount}
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderStatus)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold py-1 px-2 rounded-lg border bg-white text-gray-800 focus:outline-none focus:border-[#218838]"
                          >
                            {STATUS_LIST.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-[#218838] font-bold text-xs hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Selected Order Detail Drawer / Inspector */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-5 sticky top-24">
          {selectedOrder ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Order Details
                  </span>
                  <h3 className="font-black text-lg text-gray-900">
                    #{selectedOrder.order_number}
                  </h3>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
                  title="Print Packing Slip"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>

              {/* Status Update Dropdown */}
              <div className="p-4 bg-[#F7FAF5] rounded-2xl border border-emerald-100 space-y-2 text-xs">
                <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px] block">
                  Update Fulfillment Status:
                </span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-[#218838] rounded-xl text-[#14532D] focus:outline-none"
                >
                  {STATUS_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-500 font-semibold">Payment Status:</span>
                  <select
                    value={selectedOrder.payment_status}
                    onChange={(e) =>
                      handleUpdatePaymentStatus(
                        selectedOrder.id,
                        e.target.value as PaymentStatus
                      )
                    }
                    className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Paid on Delivery">Paid on Delivery</option>
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-gray-400">
                  Customer & Bengaluru Destination
                </h4>
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 space-y-1.5 text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{selectedOrder.customer_name}</span>
                    <a
                      href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${selectedOrder.customer_name}, this is Fresh Basket regarding your order #${selectedOrder.order_number}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#25D366] font-bold text-xs hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                  <div>Phone: <strong>{selectedOrder.customer_phone}</strong></div>
                  <div>Address: {selectedOrder.delivery_address}, {selectedOrder.neighbourhood}</div>
                  <div>Bengaluru PIN: <strong>{selectedOrder.pincode}</strong></div>
                  <div className="text-[#14532D] font-bold pt-1">
                    Slot: {selectedOrder.delivery_slot}
                  </div>
                  {selectedOrder.delivery_instructions && (
                    <div className="text-gray-500 italic pt-1 border-t border-gray-200/80">
                      Note: &quot;{selectedOrder.delivery_instructions}&quot;
                    </div>
                  )}
                </div>
              </div>

              {/* Snapshotted Items list */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-gray-400">
                  Snapshotted Order Items ({(selectedOrder.items || []).length})
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl p-2 bg-gray-50/50">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{item.product_name}</span>
                        <div className="text-[11px] text-gray-400">{item.unit}</div>
                      </div>
                      <div className="font-bold text-gray-900 text-right">
                        <span>{item.quantity} × ₹{item.unit_price}</span>
                        <div className="text-[#14532D]">₹{item.total_price}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Produce Subtotal:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee:</span>
                    <span>{selectedOrder.delivery_charge === 0 ? 'FREE' : `₹${selectedOrder.delivery_charge}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-gray-900 pt-1 border-t border-gray-200">
                    <span>Total Amount:</span>
                    <span className="text-[#14532D]">₹{selectedOrder.total_amount}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400 text-xs space-y-2">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <p>Select any order on the left to view customer details, items, and update live fulfillment status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
