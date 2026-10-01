import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  ExternalLink,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  PrintOrderRecord,
  OrderStatus,
  ORDER_STATUS_STEPS,
  formatPrintTypeLabel,
} from '../types/printbro';

interface OrderTrackerProps {
  orders: PrintOrderRecord[];
  activeTrackingCode: string;
  onSelectTrackingCode: (code: string) => void;
  onUpdateLocalOrderStatus: (trackingCode: string, newStatus: OrderStatus) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  activeTrackingCode,
  onSelectTrackingCode,
  onUpdateLocalOrderStatus,
}) => {
  const [searchInput, setSearchInput] = useState<string>(activeTrackingCode);
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  React.useEffect(() => {
    if (activeTrackingCode) {
      setSearchInput(activeTrackingCode);
    }
  }, [activeTrackingCode]);

  const currentTrackedOrder = React.useMemo(() => {
    const code = (activeTrackingCode || searchInput).trim().toUpperCase();
    if (!code) return orders[0] || null;
    const fromList = orders.find((o) => o.trackingCode.toUpperCase() === code);
    if (fromList) return fromList;
    return orders[0] || null;
  }, [activeTrackingCode, searchInput, orders]);

  const handleLookupOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchMessage(null);
    const code = searchInput.trim().toUpperCase();
    if (!code) {
      setSearchMessage('Please enter an Order Tracking ID (for example: PB-849210).');
      return;
    }

    const match = orders.find((o) => o.trackingCode.toUpperCase() === code);
    if (match) {
      onSelectTrackingCode(match.trackingCode);
    } else {
      setSearchMessage(`No print order found matching Tracking ID "${code}".`);
    }
  };

  const getStepIndex = (status: OrderStatus): number => {
    if (status === 'cancelled') return -1;
    return ORDER_STATUS_STEPS.findIndex((s) => s.status === status);
  };

  const filteredOrders = orders.filter((o) =>
    statusFilter === 'all' ? true : o.status === statusFilter
  );

  return (
    <div className="space-y-8">
      {/* Search Bar by Tracking ID */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Track Your Printing Status
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Enter your Order Tracking Code (e.g.,{' '}
              <span className="font-mono-tabular font-semibold text-slate-800">
                PB-849210
              </span>
              ) to check live campus hub readiness.
            </p>
          </div>

          <form onSubmit={handleLookupOrder} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter PB-XXXXXX"
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono-tabular uppercase text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Track Order
            </button>
          </form>
        </div>

        {searchMessage && (
          <p className="mt-3 text-xs font-medium text-amber-700">
            {searchMessage}
          </p>
        )}

        {/* Active Order Live Pipeline Display */}
        {currentTrackedOrder ? (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono-tabular">
                  <span className="font-bold text-blue-700 text-sm">
                    {currentTrackedOrder.trackingCode}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{currentTrackedOrder.studentName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentTrackedOrder.campusHub}</span>
                </div>
                <h4 className="mt-1 text-lg font-bold text-slate-900">
                  {currentTrackedOrder.fileName}
                </h4>
                <p className="mt-0.5 text-xs text-slate-500 font-mono-tabular">
                  {formatPrintTypeLabel(currentTrackedOrder.printType)} ·{' '}
                  {currentTrackedOrder.pageCount} pages × {currentTrackedOrder.copies} · Total: ৳
                  {currentTrackedOrder.totalAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {currentTrackedOrder.driveFileUrl && (
                  <a
                    href={currentTrackedOrder.driveFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>Open Shared Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {currentTrackedOrder.fileDataUrl && (
                  <a
                    href={currentTrackedOrder.fileDataUrl}
                    download={currentTrackedOrder.fileName}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                )}

                {currentTrackedOrder.status === 'received' && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateLocalOrderStatus(currentTrackedOrder.trackingCode, 'cancelled')
                    }
                    className="px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {currentTrackedOrder.status === 'cancelled' ? (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-sm text-red-800">
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>
                  This print order ({currentTrackedOrder.trackingCode}) was cancelled before printing started.
                </span>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3">
                {ORDER_STATUS_STEPS.map((step, idx) => {
                  const activeIdx = getStepIndex(currentTrackedOrder.status);
                  const isCompleted = idx <= activeIdx;
                  const isCurrent = idx === activeIdx;

                  return (
                    <div
                      key={step.status}
                      className={`p-4 rounded-xl border transition-colors ${
                        isCurrent
                          ? 'border-blue-700 bg-blue-50/50'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-slate-50/50 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono-tabular font-semibold text-slate-500">
                          {step.stepNumber}
                        </span>
                        {isCompleted ? (
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              isCurrent ? 'text-blue-700' : 'text-emerald-600'
                            }`}
                          />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {step.label}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PrintBro Status Stage Controls */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Update Printing Stage (PrintBro Desk Control):</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {ORDER_STATUS_STEPS.map((step) => (
                  <button
                    key={step.status}
                    type="button"
                    onClick={() =>
                      onUpdateLocalOrderStatus(currentTrackedOrder.trackingCode, step.status)
                    }
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      currentTrackedOrder.status === step.status
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {step.stepNumber}. {step.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-slate-100 text-center py-8">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="mt-2 text-sm font-semibold text-slate-800">
              No Active Print Orders Selected
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Place a print order above or enter your PB-XXXXXX tracking code to monitor live status.
            </p>
          </div>
        )}
      </div>

      {/* Order Queue / History Table */}
      {orders.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Campus Print Orders
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any order row to inspect its 5-stage fulfillment timeline or download the attached file.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {(['all', 'received', 'printing', 'ready', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize whitespace-nowrap cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'all' ? `All (${orders.length})` : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-3 pr-4 font-semibold">Tracking ID</th>
                  <th className="py-3 px-4 font-semibold">Document & Student</th>
                  <th className="py-3 px-4 font-semibold">Print Spec</th>
                  <th className="py-3 px-4 font-semibold text-right">Pages × Sets</th>
                  <th className="py-3 px-4 font-semibold text-right">Total (৳)</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 pl-4 font-semibold text-right">File & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-sm">
                {filteredOrders.map((order) => {
                  const isSelected = currentTrackedOrder?.trackingCode === order.trackingCode;
                  return (
                    <tr
                      key={order.trackingCode}
                      onClick={() => onSelectTrackingCode(order.trackingCode)}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 pr-4 font-mono-tabular font-bold text-blue-700 whitespace-nowrap">
                        {order.trackingCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900 truncate max-w-[220px]">
                          {order.fileName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.studentName}
                          {order.studentPhone ? ` · ${order.studentPhone}` : ''} · {order.campusHub}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-700 whitespace-nowrap">
                        {formatPrintTypeLabel(order.printType)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-tabular text-slate-700 whitespace-nowrap">
                        {order.pageCount} × {order.copies}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-tabular font-bold text-slate-900 whitespace-nowrap">
                        ৳{order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700 capitalize whitespace-nowrap">
                        {order.status}
                      </td>
                      <td
                        className="py-3.5 pl-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-3">
                          {order.fileDataUrl && (
                            <a
                              href={order.fileDataUrl}
                              download={order.fileName}
                              className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                              title="Download file"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>File</span>
                            </a>
                          )}
                          {order.driveFileUrl && (
                            <a
                              href={order.driveFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                              title="Open shared link"
                            >
                              <span>Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(
                              `PrintBro Order ${order.trackingCode}: ${order.fileName} (${
                                order.pageCount
                              } pages, Total ৳${order.totalAmount.toFixed(2)})${
                                order.driveFileUrl ? ` - Link: ${order.driveFileUrl}` : ''
                              }`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                          >
                            <span>WhatsApp</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
