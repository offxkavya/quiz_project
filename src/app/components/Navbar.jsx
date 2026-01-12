"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check login status on mount and when storage changes
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link href="/" className="logo">
                    Bittle-AI
                </Link>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/dashboard" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                        Browse Rooms
                    </Link>
                    <Link href={isLoggedIn ? "/dashboard" : "/login"} className="btn btn-primary">
                        Launch App
                    </Link>
                </div>
            </div>
        </nav>
    );
}
