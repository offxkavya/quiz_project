"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="card-clean animate-fade-in" style={{ width: '100%', maxWidth: '420px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome <span className="text-primary">Back</span></h2>
                <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter your credentials to access your arena</p>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.4rem', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>Email Address</label>
                        <input
                            className="input"
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500' }}>Password</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }} disabled={loading}>
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    New to the platform? <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
}
