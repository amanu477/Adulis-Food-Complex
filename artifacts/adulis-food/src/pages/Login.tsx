import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLogin } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Phone, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useLogin();

  if (user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(
      { data: { identifier, password } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(getGetMeQueryKey(), data);
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          setLocation(data.role === "admin" ? "/admin" : "/");
        },
        onError: (err: any) => {
          setError(err?.data?.error ?? "Invalid credentials");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-green-50 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/01/logo-removebg-preview.png"
            alt="Logo"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to continue</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone Number or Email</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="+251 9xx xxx xxxx or admin@adulis.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 shadow-lg shadow-primary/30"
          >
            {loginMutation.isPending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">Register with Phone</Link>
        </p>

        <div className="mt-4 p-3 bg-muted/50 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">Admin login: <span className="font-medium">admin@adulis.com</span></p>
        </div>
      </motion.div>
    </div>
  );
}
