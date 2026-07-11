import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listAuditLog, type AuditLogEntry } from "@/lib/audit";

const actionVariant = (action: AuditLogEntry["action"]) => {
  if (action === "insert") return "default" as const;
  if (action === "delete") return "destructive" as const;
  return "secondary" as const;
};

const AdminAuditLog = () => {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    listAuditLog().then(({ data, error }) => {
      if (error) toast.error("Couldn't load audit log", { description: error });
      setEntries(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Audit Log</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every create, edit, and delete made by an admin — most recent first.
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No admin actions recorded yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Record</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">{entry.admin_email ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={actionVariant(entry.action)} className="capitalize">
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{entry.entity_type.replace("_", " ")}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {entry.entity_id?.slice(0, 8) ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setViewing(entry)}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewing?.action} · {viewing?.entity_type}
            </DialogTitle>
          </DialogHeader>
          <pre className="text-xs bg-muted rounded-md p-4 overflow-x-auto whitespace-pre-wrap">
            {viewing ? JSON.stringify(viewing.changes, null, 2) : ""}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAuditLog;
