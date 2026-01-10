import Link from "next/link";
import "./globals.css";

export const metadata = {
    title: "Bittle-AI - Master Your Knowledge",
    description: "Experience the next generation of quiz platforms. Generate custom quizzes with AI and challenge friends in real-time.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-grid">
                <nav className="navbar">
                    <div className="container nav-content">
                        <Link href="/" className="logo">
                            Bittle-AI
                        </Link>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <Link href="/rooms" className="text-muted" style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
                                Browse Rooms
                            </Link>
                            <Link href="/login" className="btn btn-primary">
                                Launch App
                            </Link>
                        </div>
                    </div>
                </nav>
                <main className="min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
