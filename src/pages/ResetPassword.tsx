import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/lib/auth-context";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const ResetPassword = () => {
  const { user, loading, updatePassword } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await updatePassword(values.password);
    if (error) {
      toast.error("Couldn't update password", { description: error });
      return;
    }
    toast.success("Password updated");
    navigate("/account");
  });

  if (loading) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <Seo title="Reset password — Nyuzi" />
        <h1 className="text-2xl font-semibold">This link has expired</h1>
        <p className="mt-2 text-muted-foreground">
          Password reset links only work once and expire after a while. Request a new one from the sign-in menu.
        </p>
        <Button asChild className="mt-6 bg-primary hover:bg-primary-dark">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-md">
      <Seo title="Reset password — Nyuzi" />
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <p className="mt-2 text-muted-foreground">Choose a new password for {user.email}.</p>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <PasswordInput id="password" autoFocus autoComplete="new-password" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <PasswordInput id="confirmPassword" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark">
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
