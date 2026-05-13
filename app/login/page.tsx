"use client";

import { useSignIn, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { setActive } = useClerk();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (user.publicMetadata?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }, [isLoaded, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!signIn) {
      setError("Sign in is not loaded yet.");
      setLoading(false);
      return;
    }

    try {
      await signIn.create({ identifier: username, password });

      if (signIn.status === "complete") {
        await setActive({ session: signIn.createdSessionId });
      } else {
        setError("Additional verification required.");
      }
    } catch (err: any) {
      const message = err?.errors?.[0]?.longMessage ?? "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 lg:p-8">
      <div className="w-full max-w-5xl xl:max-w-6xl flex rounded-2xl overflow-hidden shadow-xl border border-border min-h-[600px]">
        <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 xl:p-16 bg-muted/40 border-r border-border relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* grid decoration */}
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-[0.04] dark:opacity-[0.07] pointer-events-none select-none">
            <ShieldCheck className="w-96 h-96" />
          </div>

          {/* logo */}
          <div className="relative flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <ShieldCheck className="h-4 w-4 text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              VinPro
            </span>
          </div>

          {/* center quote */}
          <div className="relative space-y-8 xl:space-y-10 max-w-md">
            <p className="text-3xl xl:text-4xl font-semibold tracking-tight text-foreground leading-snug">
              Instant vehicle history,
              <br />
              <span className="text-muted-foreground font-normal">
                decoded in seconds.
              </span>
            </p>

            <Separator className="w-12" />

            <div className="space-y-3">
              {[
                "Stolen vehicle cross-check",
                "Full ownership & mileage history",
                "Exportable PDF reports",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-center text-sm xl:text-base text-muted-foreground">
                  <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                  {item}
                </div>
              ))}
            </div>

            {/* stat row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              {[
                { value: "50M+", label: "Records" },
                { value: "99.9%", label: "Uptime" },
                { value: "<2s", label: "Per report" },
              ].map(({ value, label }) => (
                <div key={label} className="space-y-0.5">
                  <p className="text-lg xl:text-xl font-semibold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right panel */}
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-12 xl:px-16 bg-background">
          {/* logo*/}
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
              <ShieldCheck className="h-4 w-4 text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight">VinCheck</span>
          </div>

          {/* form container*/}
          <div className="w-full max-w-sm space-y-8">
            {/* heading */}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="your_username"
                  disabled={loading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    disabled={loading}
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="py-3">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full h-10"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}