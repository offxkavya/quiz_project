"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LeaderboardPage() {
    const searchParams = useSearchParams();
    const quizId = searchParams.get("quizId");
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!quizId) return;

        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`/api/quiz/leaderboard?quizId=${quizId}`);
                const data = await res.json();
                setLeaderboard(data.leaderboard);
            } catch (err) {
                console.error("Leaderboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [quizId]);

    return (
        <div className="container" style={{ paddingTop: '10vh' }}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    Battle <span className="gradient-text">Results</span>
                </h2>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Calculating scores...</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {leaderboard.length > 0 ? leaderboard.map((entry, i) => (
                            <div key={i} className="glass-card" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 2rem',
                                border: i === 0 ? '2px solid gold' : '1px solid var(--glass-border)',
                                background: i === 0 ? 'rgba(255, 215, 0, 0.1)' : 'var(--glass)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: i === 0 ? 'gold' : 'var(--text-muted)' }}>
                                        #{i + 1}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{entry.username}</span>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                    {entry.score} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>pts</span>
                                </div>
                            </div>
                        )) : (
                            <p style={{ textAlign: 'center' }}>No participants recorded.</p>
                        )}

                        <button
                            className="btn btn-primary"
                            style={{ marginTop: '2rem' }}
                            onClick={() => router.push("/dashboard")}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
