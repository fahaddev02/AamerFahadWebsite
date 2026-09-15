'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Truck,
  X,
  Phone,
  MapPin,
  Clock,
  Printer,
} from 'lucide-react';
import StatusBadge from '../../../components/admin/StatusBadge';
import { Order } from '../../../types/index';
import { formatPKR, formatDate } from '../../../lib/formatters';
import { useToast } from '../../../context/ToastContext';
import { fetchApi } from '../../../lib/api';

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    const res = await fetchApi<Order[]>(
      `/admin/orders?search=${encodeURIComponent(search)}&status=${statusFilter}`
    );
    if (res.success && res.data) {
      setOrders(res.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const res = await fetchApi(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ orderStatus: newStatus }),
    });

    if (res.success) {
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus as any });
      }
    } else {
      showToast(res.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Customer Orders</h1>
        <p className="text-xs text-zinc-500">
          Process Cash on Delivery shipments, assign courier tracking & manage status.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-800 focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:ring-2 focus:ring-brand-800 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending (New)</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="RETURNED">Returned</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-zinc-200">
            <thead className="bg-zinc-50 text-zinc-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Order ID</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Customer & City</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Order Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-50/80 transition">
                    <td className="px-6 py-4 font-mono font-bold text-zinc-900">{ord.orderNumber}</td>
                    <td className="px-6 py-4 text-zinc-600">{formatDate(ord.createdAt)}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-zinc-900">{ord.customerName}</p>
                      <p className="text-[11px] text-zinc-400">{ord.city}, {ord.province}</p>
                      <p className="text-[11px] font-mono text-zinc-500">{ord.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-700">
                      {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-950 font-sans">
                      {formatPKR(ord.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="text-xs font-semibold px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="RETURNED">Returned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-lg inline-flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400">Order Information</span>
                <h3 className="text-lg font-bold text-zinc-950 font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-zinc-400 hover:text-zinc-700" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1.5">
              <h4 className="font-bold text-zinc-900 text-xs uppercase">Shipping Address & Customer</h4>
              <p className="font-bold text-zinc-950 text-sm">{selectedOrder.customerName}</p>
              <p className="text-zinc-600">{selectedOrder.shippingAddress}</p>
              <p className="text-zinc-600">{selectedOrder.city}, {selectedOrder.province} {selectedOrder.postalCode}</p>
              <p className="text-zinc-900 font-mono font-semibold pt-1">
                Phone: {selectedOrder.customerPhone}
              </p>
              {selectedOrder.notes && (
                <p className="text-zinc-500 italic mt-1 bg-white p-2 rounded-lg border border-zinc-200">
                  Note: {selectedOrder.notes}
                </p>
              )}
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold text-zinc-900 text-xs uppercase mb-2">Order Items</h4>
              <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-2xl p-3 bg-white">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-900">{item.productName}</p>
                      {item.variantName && <p className="text-[11px] text-zinc-400">{item.variantName}</p>}
                      <p className="text-zinc-500">Qty: {item.quantity} × {formatPKR(item.price)}</p>
                    </div>
                    <span className="font-bold text-zinc-950 font-sans">{formatPKR(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPKR(selectedOrder.subtotal)}</span>
              </div>
              {selectedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPKR(selectedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-semibold text-zinc-900">{formatPKR(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Grand Total (COD)</span>
                <span className="text-base text-brand-900 font-sans">{formatPKR(selectedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 bg-brand-900 text-white font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

