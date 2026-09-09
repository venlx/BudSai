"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: username,
      email: email || `${username}@local`,
      password,
      username,
    });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Sign up failed");
    } else {
      router.push("/");
    }
  }

  async function handleSocial(provider: "google" | "github") {
    await authClient.signIn.social({ provider, callbackURL: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-secondary-color p-8 rounded-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-forth-color">Sign Up</h2>

        {/* OAuth buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleSocial("google")}
            className="flex items-center justify-center gap-2 bg-primary-color text-forth-color p-2 rounded hover:opacity-80"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocial("github")}
            className="flex items-center justify-center gap-2 bg-primary-color text-forth-color p-2 rounded hover:opacity-80"
          >
            <GitHubIcon />
            Continue with GitHub
          </button>
        </div>

        <div className="flex items-center gap-2 text-forth-color text-sm">
          <span className="flex-1 h-px bg-third-color" />
          or
          <span className="flex-1 h-px bg-third-color" />
        </div>

        <form action={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-2 rounded bg-primary-color text-forth-color"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded bg-primary-color text-forth-color"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded bg-primary-color text-forth-color"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-color text-forth-color p-2 rounded hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-forth-color text-sm">
          Have an account?{" "}
          <Link href="/sign-in" className="text-primary-color hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
