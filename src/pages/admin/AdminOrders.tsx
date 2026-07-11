import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listAllOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/orders";

const STATUSES: OrderStatus[] = [
  "pending_payment",
  "awaiting_manual_payment",
  "paid",
  "payment_failed",
  "fulfilled",
  "cancelled",
];

const badgeVariant = (status: OrderStatus) => {
  if (status === "paid" || status === "fulfilled") return "default" as const;
  if (status === "payment_failed" || status === "cancelled") return "destructive" as const;
  return "secondary" as const;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await listAllOrders();
    if (error) toast.error("Couldn't load orders", { description: error });
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    const { error } = await updateOrderStatus(id, status);
    if (error) {
      toast.error("Couldn't update order", { description: error });
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success("Order updated");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Orders</h1>
      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
                  </TableCell>
                  <TableCell>${o.total_amount.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">
                    {o.payment_method}
                    {o.mpesa_receipt_number && (
                      <div className="text-xs text-muted-foreground font-mono">{o.mpesa_receipt_number}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={badgeVariant(o.status)}>{o.status.replace("_", " ")}</Badge>
                      <Select value={o.status} onValueChange={(v) => handleStatusChange(o.id, v as OrderStatus)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
