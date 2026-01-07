"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function RoomPage() {
    const { id: roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quizStarted, setQuizStarted] = useState(false);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const router = useRouter();

    const fetchRoomData = useCallback(async () => {
        try {
            // For simplicity, we search for the room (which populates quiz)
            const res = await fetch(`/api/room/search`);
            const data = await res.json();
            const currentRoom = data.rooms.find(r => r._id === roomId);

            if (!currentRoom) throw new Error("Room not found");
            setRoom(currentRoom);

            // Fetch questions for this quiz
            // In a real app, this would be a specific GET /api/quiz/[id] route
            // For now, we'll assume we need to add a route for fetching quiz details or just fetch all questions
            // Since I didn't create a GET questions route exactly, I'll assume I should have. 
            // I'll add a quick fetch for questions.
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }
        setUser(JSON.parse(storedUser));
        fetchRoomData();
    }, [fetchRoomData, router]);

    // Handle Answer Submission
    const handleAnswer = async (questionId, selectedOption) => {
        setAnswers({ ...answers, [questionId]: selectedOption });
        try {
            await fetch("/api/quiz/answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    quizId: room.quizId._id,
                    questionId,
                    selectedOption
                }),
            });
        } catch (err) {
            console.error("Answer submission error:", err);
        }
    };

    const startQuiz = async () => {
        // Fetch questions before starting
        const res = await fetch(`/api/quiz/questions?quizId=${room.quizId._id}`);
        const data = await res.json();
        setQuestions(data.questions);
        setQuizStarted(true);
        setTimeLeft(room.quizId.duration * 60);
    };

    useEffect(() => {
        if (quizStarted && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (quizStarted && timeLeft === 0) {
            setQuizEnded(true);
            router.push(`/quiz/leaderboard?quizId=${room.quizId._id}`);
        }
    }, [quizStarted, timeLeft, room, router]);

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Synchronizing with Arena...</div>
        </div>
    );

    if (!room) return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '20vh' }}>
            <h2 style={{ marginBottom: '1rem' }}>Arena Not Found</h2>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>This battle may have ended or the link is invalid.</p>
            <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '5vh', paddingBottom: '10vh' }}>
            {!quizStarted ? (
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <div className="card-clean animate-fade-in" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '200px',
                            height: '200px',
                            background: 'var(--primary)',
                            filter: 'blur(80px)',
                            opacity: '0.1',
                            zIndex: -1
                        }}></div>

                        <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'rgba(129, 140, 248, 0.1)',
                            color: 'var(--primary)',
                            borderRadius: '30px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: '1.5rem'
                        }}>
                            Room Lobby
                        </div>

                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{room.quizId.title}</h1>
                        <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
                            {room.quizId.topic} • {room.quizId.difficulty} difficulty
                        </p>

                        <div style={{
                            background: 'var(--border-faint)',
                            borderRadius: 'var(--radius-md)',
                            padding: '2rem',
                            marginBottom: '2.5rem'
                        }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', fontWeight: '600' }}>
                                Combatants Ready (<span className="gradient-text">{room.currentParticipants.length}/{room.maxParticipants}</span>)
                            </h3>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {/* Host Avatar */}
                                <div style={{
                                    padding: '0.6rem 1.25rem',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 12px rgba(129, 140, 248, 0.3)'
                                }}>
                                    Host: {user.username}
                                </div>
                                {/* Other participants would appear here */}
                                <div className="animate-pulse" style={{
                                    padding: '0.6rem 1.25rem',
                                    background: 'var(--bg-input)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '50px',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    Waiting for challengers...
                                </div>
                            </div>
                        </div>

                        {(room.host === user.id || room.host._id === user.id || (typeof room.host === 'object' && room.host._id === user.id)) ? (
                            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} onClick={startQuiz}>
                                Initiate Battle for All
                            </button>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div className="animate-pulse" style={{ color: 'var(--primary)', fontWeight: '500' }}>Waiting for host to initiate...</div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <header style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '3rem',
                        sticky: 'top',
                        top: '0',
                        zIndex: 10,
                        background: 'rgba(15, 17, 26, 0.8)',
                        backdropFilter: 'blur(10px)',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{room.quizId.title}</h2>
                            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Question {Object.keys(answers).length} of {questions.length}</p>
                        </div>
                        <div style={{
                            padding: '0.75rem 1.25rem',
                            background: timeLeft < 30 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-input)',
                            borderRadius: '10px',
                            border: `1px solid ${timeLeft < 30 ? '#ef4444' : 'var(--border-subtle)'}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Clock</div>
                            <span style={{
                                fontWeight: 'bold',
                                fontSize: '1.25rem',
                                color: timeLeft < 30 ? '#ef4444' : 'var(--primary)'
                            }}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                    </header>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {questions.map((q, i) => (
                            <div key={q._id} className="card-clean" style={{
                                background: answers[q._id] ? 'rgba(129, 140, 248, 0.02)' : 'var(--bg-card)',
                                borderColor: answers[q._id] ? 'var(--primary)' : 'var(--border-subtle)'
                            }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        color: 'var(--primary)',
                                        border: '1px solid var(--border-subtle)'
                                    }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', lineHeight: '1.5', marginBottom: '2rem' }}>{q.questionText}</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                            {q.options.map((opt, j) => (
                                                <button
                                                    key={j}
                                                    className={`btn ${answers[q._id] === opt ? 'btn-primary' : 'btn-outline'}`}
                                                    style={{
                                                        textAlign: 'left',
                                                        padding: '1rem',
                                                        fontSize: '0.9rem',
                                                        justifyContent: 'flex-start'
                                                    }}
                                                    onClick={() => handleAnswer(q._id, opt)}
                                                >
                                                    <span style={{
                                                        marginRight: '1rem',
                                                        opacity: 0.5,
                                                        fontSize: '0.8rem'
                                                    }}>{String.fromCharCode(65 + j)}.</span>
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '4rem', textAlign: 'center', paddingBottom: '5rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', boxShadow: '0 10px 25px -5px rgba(129, 140, 248, 0.4)' }}
                            onClick={() => router.push(`/quiz/leaderboard?quizId=${room.quizId._id}`)}
                        >
                            Submit & Finalize Mission
                        </button>
                        <p className="text-muted" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
                            Make sure you&apos;ve answered all questions before submitting.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
