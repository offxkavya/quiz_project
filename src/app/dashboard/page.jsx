"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [searchTopic, setSearchTopic] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
        } else {
            setUser(JSON.parse(storedUser));
            fetchRooms();
        }
    }, [router]);

    const fetchRooms = async (topic = "") => {
        setLoading(true);
        try {
            const res = await fetch(`/api/room/search?topic=${topic}`);
            const data = await res.json();
            setRooms(data.rooms || []);
        } catch (err) {
            console.error("Fetch Rooms Error:", err);
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRooms(searchTopic);
    };

    if (!user) return null;

    const handleJoinRoom = async (room) => {
        let password = null;
        if (room.roomType === "locked") {
            password = prompt("This room is password protected. Enter password:");
            if (!password) return;
        }

        try {
            const res = await fetch("/api/room/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ roomId: room._id, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            router.push(`/room/${room._id}`);
        } catch (err) {
            alert(err.message);
        }
    };

    if (!user) return null;

    return (
        <div className="container" style={{ paddingTop: '5vh', paddingBottom: '10vh' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4rem',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Welcome, <span className="text-primary">{user.username}</span></h1>
                    <p className="text-muted" style={{ fontSize: '1rem' }}>Your knowledge dashboard is ready.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/quiz/generate" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create New Quiz
                    </Link>
                    <button onClick={() => { localStorage.clear(); router.push("/"); }} className="btn btn-outline" style={{ padding: '0.75rem 1.25rem' }}>
                        Sign Out
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3rem' }}>
                {/* Sidebar Search/Filters */}
                <aside>
                    <div className="card-clean" style={{ position: 'sticky', top: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: '600' }}>Find a Battle</h3>
                        <form onSubmit={handleSearch}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Search Topic</label>
                                <input
                                    className="input"
                                    placeholder="e.g. Science, Tech..."
                                    value={searchTopic}
                                    onChange={(e) => setSearchTopic(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Search Area</button>
                        </form>

                        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-faint)' }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Quick Stats</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontSize: '0.85rem' }}>Active Rooms</span>
                                <span style={{ fontWeight: '600' }}>{rooms?.length || 0}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.85rem' }}>Rank</span>
                                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Novice</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content: Room List */}
                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem' }}>Active <span className="text-primary">Quizzes</span></h2>
                        <button onClick={() => fetchRooms()} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Refresh</button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Scanning architecture for active rooms...</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {rooms?.length > 0 ? rooms.map((room) => (
                                <div key={room._id} className="card-clean animate-fade-in hover-lift">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{
                                            padding: '0.35rem 0.75rem',
                                            background: room.quizId.difficulty === 'hard' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                                            color: room.quizId.difficulty === 'hard' ? '#ef4444' : 'var(--primary)',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {room.quizId.difficulty}
                                        </div>
                                        {room.roomType === "locked" && (
                                            <div title="Private Room" style={{ color: 'var(--accent)' }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                            </div>
                                        )}
                                    </div>

                                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{room.quizId.title}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                        Topic: {room.quizId.topic}
                                    </p>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid var(--border-faint)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {room.currentParticipants.length}/{room.maxParticipants} Fighting
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleJoinRoom(room)}
                                            className="btn btn-primary"
                                            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                                        >
                                            Join Battle
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="card-clean" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                                    <h4 style={{ marginBottom: '1rem' }}>No active battles found</h4>
                                    <p className="text-muted" style={{ marginBottom: '2rem' }}>Be the pioneer. Create your own AI-powered quiz and invite others to compete.</p>
                                    <Link href="/quiz/generate" className="btn btn-primary">Create Your First Room</Link>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
