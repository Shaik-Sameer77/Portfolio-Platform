"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { loginUser, registerUser } from "@/services/comment-service";
import { toast } from "sonner";

export const AuthModal = () => {
  const { modalOpen, modalTab, closeModal, setModalTab, login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // Clear inputs when modal state changes
  useEffect(() => {
    if (!modalOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setError("");
      setInfo("");
      setLoading(false);
    }
  }, [modalOpen]);

  // Clear local messages when switching tabs
  const handleTabChange = (tab: "login" | "register") => {
    setModalTab(tab);
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (modalTab === "login") {
        const data = await loginUser(email, password);
        login(data.access_token, data.user);
        toast.success("Welcome back! Signed in successfully.");
      } else {
        const data = await registerUser(email, password, name);
        setInfo(data.message || "Registration successful! Please check your email to verify your account.");
        toast.success("Registration successful! Check email.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "An unexpected error occurred.";
      setError(Array.isArray(msg) ? msg.join(" · ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface/90 p-8 shadow-2xl backdrop-blur-xl mx-4"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-all duration-150 active:scale-95"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-6 text-left">
              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
                {modalTab === "login" ? "Sign In" : "Create Account"}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {modalTab === "login"
                  ? "Welcome back. Log in to join the discussion."
                  : "Sign up to begin sharing thoughts in the discussion."}
              </p>
            </div>

            {/* Tabs */}
            <div className="relative mb-6 flex gap-1 rounded-xl bg-surface-2/65 p-1">
              {(["login", "register"] as const).map((tab) => {
                const isActive = modalTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabChange(tab)}
                    className="relative flex-1 rounded-lg py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 rounded-lg bg-primary shadow-sm shadow-primary/30"
                        transition={{ type: "spring", duration: 0.45 }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? "text-white" : "text-muted-foreground hover:text-foreground"}`}>
                      {tab === "login" ? "Sign In" : "Register"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {modalTab === "register" && (
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Display name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-surface-2/40 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-150"
                  />
                </div>
              )}

              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-surface-2/40 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-150"
                />
              </div>

              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-surface-2/40 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all duration-150"
                />
              </div>

              {/* Error messages */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive leading-normal"
                >
                  {error}
                </motion.div>
              )}

              {/* Success Info messages */}
              {info && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-xs font-medium text-success-foreground leading-normal"
                >
                  {info}
                </motion.div>
              )}

              {/* Submit trigger */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-semibold text-white hover:bg-primary/95 disabled:opacity-50 transition-all duration-150 shadow-sm shadow-primary/30 hover:shadow-primary/45 active:scale-[0.98] select-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait…
                  </>
                ) : modalTab === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Switch view footer text */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              {modalTab === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("register")}
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleTabChange("login")}
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
