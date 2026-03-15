import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSendOtp, useRegister } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey } from "@workspace/api-client-react";
import { Phone, KeyRound, User, Lock, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Step = "phone" | "otp" | "details";

export default function Register() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const sendOtpMutation = useSendOtp();
  const registerMutation = useRegister();

  if (user) {
    setLocation("/");
    return null;
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) { setError("Enter a valid phone number"); return; }
    sendOtpMutation.mutate(
      { data: { phone } },
      {
        onSuccess: (data) => {
          if (data.devOtp) setDevOtp(data.devOtp);
          setStep("otp");
        },
        onError: (err: any) => setError(err?.data?.error ?? "Failed to send OTP"),
      }
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otpCode.length !== 4) { setError("Enter the 4-digit code"); return; }
    setStep("details");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Name is required"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    registerMutation.mutate(
      { data: { name, phone, password, otpCode } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(getGetMeQueryKey(), data);
          setLocation("/products");
        },
        onError: (err: any) => setError(err?.data?.error ?? "Registration failed"),
      }
    );
  };

  const steps = [
    { id: "phone", label: "Phone", icon: Phone },
    { id: "otp", label: "Verify", icon: KeyRound },
    { id: "details", label: "Account", icon: User },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-green-50 px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="https://superboostup.com/AdulisFarm/wp-content/uploads/2026/01/logo-removebg-preview.png"
            alt="Logo"
            className="h-14 mx-auto mb-3"
          />
          <h1 className="text-2xl font-display font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground text-sm mt-1">Join the Adulis family</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((s, i) => {
            const isDone = steps.findIndex(x => x.id === step) > i;
            const isActive = s.id === step;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex flex-col items-center`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDone ? "bg-green-500 text-white" :
                    isActive ? "bg-primary text-white shadow-lg shadow-primary/30" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {isDone ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-1 mb-5 transition-colors duration-300 ${isDone ? "bg-green-500" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
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

        <AnimatePresence mode="wait">
          {/* Step 1: Phone */}
          {step === "phone" && (
            <motion.form
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 9xx xxx xxxx"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">A 4-digit verification code will be sent to this number.</p>
              </div>
              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                {sendOtpMutation.isPending ? "Sending OTP…" : <>Send Verification Code <ArrowRight className="h-4 w-4" /></>}
              </button>
            </motion.form>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <div className="text-center mb-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="h-7 w-7 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the 4-digit code sent to <strong className="text-foreground">{phone}</strong>
                </p>
              </div>

              {devOtp && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-700 font-medium">Your verification code:</p>
                  <p className="text-3xl font-bold text-amber-800 tracking-[0.4em] mt-1">{devOtp}</p>
                </div>
              )}

              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • •"
                  className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-primary transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                Verify Code <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtpCode(""); setDevOtp(null); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition py-2"
              >
                ← Change phone number
              </button>
            </motion.form>
          )}

          {/* Step 3: Name + Password */}
          {step === "details" && (
            <motion.form
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Abebe Girma"
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition disabled:opacity-60 shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                {registerMutation.isPending ? "Creating account…" : <>Create Account <CheckCircle className="h-4 w-4" /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
