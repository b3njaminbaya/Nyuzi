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
import { supabase } from "@/lib/supabase";

type Donation = {
  id: string;
  title: string;
  category: string;
  condition: number;
  notes: string | null;
  photo_count: number;
  pickup_requested: boolean;
  status: "submitted" | "scheduled" | "collected" | "processed";
  created_at: string;
};

const STATUSES: Donation["status"][] = ["submitted", "scheduled", "collected", "processed"];

const AdminDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Couldn't load donations", { description: error.message });
    setDonations((data as Donation[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const updateStatus = async (id: string, status: Donation["status"]) => {
    const { error } = await supabase.from("donations").update({ status }).eq("id", id);
    if (error) {
      toast.error("Couldn't update status", { description: error.message });
      return;
    }
    setDonations((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    toast.success("Status updated");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Donations</h1>
      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : donations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No donations yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Pickup?</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="font-medium">{d.title}</div>
                    {d.notes && <div className="text-xs text-muted-foreground">{d.notes}</div>}
                  </TableCell>
                  <TableCell className="capitalize">{d.category}</TableCell>
                  <TableCell>{d.condition}%</TableCell>
                  <TableCell>
                    {d.pickup_requested ? (
                      <Badge>Requested</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(d.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select value={d.status} onValueChange={(v) => updateStatus(d.id, v as Donation["status"])}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default AdminDonations;
