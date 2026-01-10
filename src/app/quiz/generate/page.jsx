"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizGenerate() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [topics, setTopics] = useState({ topic: "", difficulty: "medium", numQuestions: 5 });
    const [generatedQuestions, setGeneratedQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [quizDetails, setQuizDetails] = useState({
        title: "",
        duration: 10,
        roomType: "open",
        password: ""
    });
    const router = useRouter();

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/quiz/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(topics),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setGeneratedQuestions(data.questions);
            setSelectedQuestions(data.questions.map((_, i) => i)); // select all by default
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (index) => {
        if (selectedQuestions.includes(index)) {
            setSelectedQuestions(selectedQuestions.filter(i => i !== index));
        } else {
            setSelectedQuestions([...selectedQuestions, index]);
        }
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const selectedData = generatedQuestions.filter((_, i) => selectedQuestions.includes(i));

            const res = await fetch("/api/quiz/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    title: quizDetails.title,
                    duration: quizDetails.duration,
                    topic: topics.topic,
                    difficulty: topics.difficulty,
                    questions: selectedData
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Successfully created quiz, now create a room for it
            const roomRes = await fetch("/api/room/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    quizId: data.quizId,
                    maxParticipants: 10,
                    roomType: quizDetails.roomType,
                    password: quizDetails.roomType === "locked" ? quizDetails.password : null
                }),
            });

            const roomData = await roomRes.json();
            if (!roomRes.ok) throw new Error(roomData.error);

            router.push(`/room/${roomData.room._id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '8vh', paddingBottom: '10vh' }}>
            <div className="card-clean animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {step === 1 && (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Generate <span className="text-primary">AI Quiz</span></h2>
                        <p className="text-muted" style={{ marginBottom: '2.5rem' }}>Harness Groq AI to create custom-tailored questions in seconds.</p>

                        <form onSubmit={handleGenerate}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Topic or Subject</label>
                                <input className="input" placeholder="e.g. Modern Web Architecture, Roman History" required
                                    value={topics.topic} onChange={(e) => setTopics({ ...topics, topic: e.target.value })} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Difficulty Level</label>
                                    <select className="input" value={topics.difficulty} onChange={(e) => setTopics({ ...topics, difficulty: e.target.value })}>
                                        <option value="easy">Beginner</option>
                                        <option value="medium">Intermediate</option>
                                        <option value="hard">Expert</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Number of Questions</label>
                                    <input className="input" type="number" min="1" max="15" value={topics.numQuestions}
                                        onChange={(e) => setTopics({ ...topics, numQuestions: parseInt(e.target.value) })} />
                                </div>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
                                {loading ? "Architecting Questions..." : "Generate AI Questions"}
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Curate <span className="text-primary">Questions</span></h2>
                        <p className="text-muted" style={{ marginBottom: '2rem' }}>Review the generated questions. Click to toggle them in your quiz.</p>

                        <div style={{ maxHeight: '450px', overflowY: 'auto', marginBottom: '2.5rem', paddingRight: '1rem' }}>
                            {generatedQuestions.map((q, i) => (
                                <div key={i} className="card-clean" style={{
                                    marginBottom: '1rem',
                                    padding: '1.25rem',
                                    cursor: 'pointer',
                                    border: selectedQuestions.includes(i) ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                                    background: selectedQuestions.includes(i) ? 'rgba(129, 140, 248, 0.05)' : 'var(--bg-card)'
                                }} onClick={() => toggleQuestion(i)}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ color: selectedQuestions.includes(i) ? 'var(--primary)' : 'var(--text-muted)' }}>
                                            {selectedQuestions.includes(i) ? "●" : "○"}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>{q.questionText}</p>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                {q.options.map((opt, j) => (
                                                    <div key={j} style={{
                                                        fontSize: '0.85rem',
                                                        padding: '0.5rem',
                                                        borderRadius: '4px',
                                                        background: opt === q.correctAnswer ? 'rgba(16, 185, 129, 0.1)' : 'var(--border-faint)',
                                                        color: opt === q.correctAnswer ? '#10b981' : 'var(--text-muted)',
                                                        border: opt === q.correctAnswer ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent'
                                                    }}>
                                                        {opt} {opt === q.correctAnswer && "✓"}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '1.5rem' }}>
                            <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                            <button className="btn btn-primary" onClick={() => setStep(3)} disabled={selectedQuestions.length === 0}>
                                Continue to Final Details ({selectedQuestions.length} Selected)
                            </button>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Final <span className="text-primary">Configuration</span></h2>
                        <p className="text-muted" style={{ marginBottom: '2.5rem' }}>Set your battle parameters and launch the arena.</p>

                        <form onSubmit={handleCreateQuiz}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Quiz Title</label>
                                <input className="input" placeholder="e.g. JavaScript Master Battle" required
                                    value={quizDetails.title} onChange={(e) => setQuizDetails({ ...quizDetails, title: e.target.value })} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Duration (min)</label>
                                    <input className="input" type="number" min="1" max="60" required
                                        value={quizDetails.duration} onChange={(e) => setQuizDetails({ ...quizDetails, duration: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Room Privacy</label>
                                    <select className="input" value={quizDetails.roomType} onChange={(e) => setQuizDetails({ ...quizDetails, roomType: e.target.value })}>
                                        <option value="open">Public (Open)</option>
                                        <option value="locked">Private (Locked)</option>
                                    </select>
                                </div>
                            </div>

                            {quizDetails.roomType === "locked" && (
                                <div style={{ marginBottom: '2rem' }} className="animate-fade-in">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Set Room Password</label>
                                    <input className="input" type="password" placeholder="Enter room password" required
                                        value={quizDetails.password} onChange={(e) => setQuizDetails({ ...quizDetails, password: e.target.value })} />
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '1.5rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                                <button className="btn btn-primary" disabled={loading}>
                                    {loading ? "Launching Arena..." : "Launch Global Room"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {error && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
