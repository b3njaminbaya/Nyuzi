import { CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type FormBannerState = { type: "success" | "error"; title: string; description?: string };

const FormBanner = ({ state }: { state: FormBannerState | null }) => {
  if (!state) return null;

  return (
    <Alert variant={state.type === "success" ? "success" : "destructive"} className="mb-4">
      {state.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertTitle>{state.title}</AlertTitle>
      {state.description && <AlertDescription>{state.description}</AlertDescription>}
    </Alert>
  );
};

export default FormBanner;
