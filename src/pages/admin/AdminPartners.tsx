import { useEffect, useState } from "react";
import { toast } from "sonner";
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

type PartnerApplication = {
  id: string;
  full_name: string;
  email: string;
  organization: string;
  partnership_type: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const STATUSES: PartnerApplication["status"][] = ["pending", "approved", "rejected"];

const AdminPartners = () => {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partner_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Couldn't load applications", { description: error.message });
    setApplications((data as PartnerApplication[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const updateStatus = async (id: string, status: PartnerApplication["status"]) => {
    const { error } = await supabase.from("partner_applications").update({ status }).eq("id", id);
    if (error) {
      toast.error("Couldn't update status", { description: error.message });
      return;
    }
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success("Status updated");
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Partner Applications</h1>
      <div className="mt-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="font-medium">{a.full_name}</div>
                    <div className="text-xs text-muted-foreground">{a.email}</div>
                  </TableCell>
                  <TableCell>{a.organization}</TableCell>
                  <TableCell>{a.partnership_type}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground" title={a.message}>
                    {a.message}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v as PartnerApplication["status"])}>
                      <SelectTrigger className="w-32">
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

export default AdminPartners;
