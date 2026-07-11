import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { Link } from "react-router-dom";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, "Enter your name"),
});

const resetSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;
type ResetValues = z.infer<typeof resetSchema>;

const ForgotPasswordForm = ({ onBack }: { onBack: () => void }) => {
  const { requestPasswordReset } = useAuth();
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await requestPasswordReset(values.email);
    if (error) {
      toast.error("Couldn't send reset email", { description: error });
      return;
    }
    setSent(true);
  });

  if (sent) {
    return (
      <div className="space-y-4 py-2 text-sm">
        <p>If an account exists for that email, we've sent a link to reset your password.</p>
        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your account email and we'll send you a link to reset your password.
      </p>
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input id="reset-email" type="email" autoFocus autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark">
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
      <button
        type="button"
        onClick={onBack}
        className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Back to sign in
      </button>
    </form>
  );
};

const SignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { signIn } = useAuth();
  const [showReset, setShowReset] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await signIn(values.email, values.password);
    if (error) {
      toast.error("Couldn't sign in", { description: error });
      return;
    }
    toast.success("Signed in");
    onSuccess();
  });

  if (showReset) {
    return <ForgotPasswordForm onBack={() => setShowReset(false)} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email</Label>
        <Input id="signin-email" type="email" autoFocus autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="signin-password">Password</Label>
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="text-xs text-primary hover:underline"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput id="signin-password" autoComplete="current-password" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark">
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};

const SignUpForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await signUp(values.email, values.password, values.fullName);
    if (error) {
      toast.error("Couldn't create account", { description: error });
      return;
    }
    toast.success("Account created", {
      description: "Check your email to confirm your address if prompted.",
    });
    onSuccess();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full name</Label>
        <Input id="signup-name" type="text" autoFocus autoComplete="name" {...register("fullName")} />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <PasswordInput id="signup-password" autoComplete="new-password" {...register("password")} />
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">At least 6 characters</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary-dark">
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
};

const AuthDialog = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (user) {
    const initial = (user.user_metadata?.full_name || user.email || "?").charAt(0).toUpperCase();
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Account menu">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">{initial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            {user.email}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/account">My account</Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard">Admin panel</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Sign in">
          <User size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Sign in to Nyuzi</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="pt-4">
            <SignInForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="signup" className="pt-4">
            <SignUpForm onSuccess={() => setOpen(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
