import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata = {
    title: "Bittle-AI - Master Your Knowledge",
    description: "Experience the next generation of quiz platforms. Generate custom quizzes with AI and challenge friends in real-time.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="bg-grid">
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
