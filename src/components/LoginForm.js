"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNexa } from "./NexaProvider";

export default function LoginForm() {
  const { user, authReady, login, toast } = useNexa();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (authReady && user) router.replace("/dashboard");
  }, [authReady, user, router]);

  const submit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return setErr("Enter your username and password.");
    if (!login(username, password)) return setErr("Wrong username or password.");
    toast("Logged in");
    router.push("/dashboard");
  };

  return (
    <section>
      <div className="wrap" style={{ maxWidth: 440 }}>
        <p className="eyebrow">Welcome back</p>
        <h2 style={{ marginTop: 10 }}>Log in to NeXa</h2>
        <p className="muted" style={{ marginTop: 8 }}>See your deals, player IDs and wallet.</p>
        <form className="panel form" noValidate onSubmit={submit} style={{ marginTop: 20, display: "grid", gap: 14 }}>
          <label className="f">Username
            <input autoFocus autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="f">Password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <p className="err-msg" aria-live="polite">{err}</p>
          <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Log in</button>
          <p className="hint">Demo account: <span className="mono">testaccount</span> / <span className="mono">test12345</span></p>
        </form>
      </div>
    </section>
  );
}
