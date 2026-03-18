import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/format';

const OrderStatusBadge = ({ status }) => {
  const styles = {
    Pending:   'bg-[#fafafa] text-[#6b6b6b] border-[#e8e8e8]',
    Shipped:   'bg-[#e8e8e8] text-[#0a0a0a] border-[#d0d0d0]',
    Completed: 'bg-[#0a0a0a] text-white border-[#0a0a0a]',
    Cancelled: 'bg-white text-[#a0a0a0] border-[#e8e8e8]',
  };
  return (
    <span className={`inline-block border text-[10px] font-medium tracking-[0.06em] uppercase px-2.5 py-1 ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <h1 className="label-sm text-[#0a0a0a] mb-1">My account</h1>
          <p className="text-[13px] text-[#6b6b6b]">{user?.name} · {user?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-ghost-dark">Sign out</button>
      </div>

      {/* Orders */}
      <h2 className="label-sm text-[#0a0a0a] mb-6">Order history</h2>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#f4f4f4] rounded animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0] mb-5">No orders yet</p>
          <Link to="/" className="btn-black">Start shopping →</Link>
        </div>
      ) : (
        <div className="border border-[#e8e8e8]">
          {orders.map((order, idx) => (
            <div key={order.id} className={`flex items-center justify-between px-5 py-4 ${idx < orders.length - 1 ? 'border-b border-[#e8e8e8]' : ''}`}>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[12px] font-medium text-[#0a0a0a]">Order #{order.id}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-[11px] text-[#a0a0a0]">
                  {new Date(order.order_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <p className="text-[13px] text-[#0a0a0a] font-medium">{formatPrice(order.total_amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
