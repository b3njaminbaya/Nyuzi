import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import Seo from "@/components/Seo";
import { useAuth } from "@/lib/auth-context";
import { listMyOrders, type Order, type OrderStatus } from "@/lib/orders";
import { listMyDonations, type MyDonation } from "@/lib/submissions";

const orderStatusVariant = (status: OrderStatus) => {
  if (status === "paid" || status === "fulfilled") return "default" as const;
  if (status === "payment_failed" || status === "cancelled") return "destructive" as const;
  return "secondary" as const;
};

const donationStatusVariant = (status: MyDonation["status"]) => {
  if (status === "processed" || status === "collected") return "default" as const;
  return "secondary" as const;
};

const MyAccount = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [donations, setDonations] = useState<MyDonation[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([listMyOrders(user.id), listMyDonations(user.id)]).then(
      ([ordersRes, donationsRes]) => {
        setOrders(ordersRes.data);
        setDonations(donationsRes.data);
        setDataLoading(false);
      }
    );
  }, [user]);

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo title="My Account — Nyuzi" />
      <h1 className="text-3xl font-semibold">My Account</h1>
      <p className="mt-2 text-muted-foreground">{user.email}</p>

      <section className="mt-10">
        <h2 className="text-xl font-display font-semibold">Orders</h2>
        {dataLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No orders yet. <Link to="/marketplace" className="text-primary hover:underline">Browse the marketplace</Link>.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/order/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:shadow-sm transition"
              >
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{order.id.slice(0, 8)}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${order.total_amount.toFixed(2)}</div>
                  <Badge variant={orderStatusVariant(order.status)} className="mt-1">
                    {order.status.replace("_", " ")}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-display font-semibold">Donations</h2>
        {dataLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
        ) : donations.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No donations yet. <Link to="/donate" className="text-primary hover:underline">Start a donation</Link>.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div>
                  <div className="font-medium">{donation.title}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {donation.category} · {new Date(donation.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Badge variant={donationStatusVariant(donation.status)}>{donation.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyAccount;
