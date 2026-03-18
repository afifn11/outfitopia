import React from 'react';
import { formatPrice } from '../utils/format';

const STATUS_STYLES = {
  Pending:   'bg-[#fafafa] text-[#6b6b6b] border-[#e8e8e8]',
  Shipped:   'bg-[#e8e8e8] text-[#0a0a0a] border-[#d0d0d0]',
  Completed: 'bg-[#0a0a0a] text-white border-[#0a0a0a]',
  Cancelled: 'bg-white text-[#a0a0a0] border-[#e8e8e8]',
};

const OrderHistoryItem = ({ order }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e8e8] last:border-0">
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[12px] font-medium text-[#0a0a0a]">Order #{order.id}</span>
        <span className={`inline-block border text-[10px] font-medium tracking-[0.06em] uppercase px-2.5 py-1 ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}>
          {order.status}
        </span>
      </div>
      <p className="text-[11px] text-[#a0a0a0]">
        {new Date(order.order_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
    <p className="text-[13px] font-medium text-[#0a0a0a]">{formatPrice(order.total_amount)}</p>
  </div>
);

export default OrderHistoryItem;
