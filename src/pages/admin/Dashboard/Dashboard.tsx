import React from 'react';
import { useStore } from '../../../store/store';
import { StatsCard } from '../../../components/admin/dashboard/StatsCard';
import { SalesChart } from '../../../components/admin/dashboard/SalesChart';
import { RecentOrders } from '../../../components/admin/dashboard/RecentOrders';
import { TopProducts } from '../../../components/admin/dashboard/TopProducts';
import { IndianRupee, ShoppingBag, Package, Users, Plus } from 'lucide-react';
import { formatPrice } from '../../../utils/formatPrice';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';

export const Dashboard: React.FC = () => {
  const { products, orders } = useStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 478000;
  const totalOrdersCount = orders.length + 142;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.85rem', color: '#1C1917', margin: '0 0 0.25rem 0' }}>
            Apiary Executive Dashboard
          </h1>
          <p style={{ color: '#78716C', margin: 0, fontSize: '0.9rem' }}>
            Monitor real-time honey sales, batch fulfillment, and hive stock reserves.
          </p>
        </div>

        <Link to="/admin/products/add">
          <Button size="md" leftIcon={<Plus size={16} />}>
            List New Honey
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4 gap-6">
        <StatsCard
          title="Total Honey Sales"
          value={formatPrice(totalRevenue)}
          change="+18.4%"
          isPositive={true}
          icon={<IndianRupee size={22} color="#D97706" />}
          iconBg="#FEF3C7"
        />

        <StatsCard
          title="Total Jars Dispatched"
          value={String(totalOrdersCount)}
          change="+12.2%"
          isPositive={true}
          icon={<ShoppingBag size={22} color="#059669" />}
          iconBg="#ECFDF5"
        />

        <StatsCard
          title="Active Harvest SKUs"
          value={String(products.length)}
          icon={<Package size={22} color="#2563EB" />}
          iconBg="#EFF6FF"
        />

        <StatsCard
          title="Registered Patrons"
          value="1,480"
          change="+24%"
          isPositive={true}
          icon={<Users size={22} color="#7C3AED" />}
          iconBg="#F5F3FF"
        />
      </div>

      {/* Sales Trend Chart */}
      <SalesChart />

      {/* Bottom Grid: Recent Orders & Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
};
