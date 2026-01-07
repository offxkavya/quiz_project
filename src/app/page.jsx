import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="container" style={{ paddingTop: '8vh', paddingBottom: '10vh' }}>
            {/* Hero Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '4rem',
                alignItems: 'center',
                minHeight: '60vh'
            }}>
                <div className="animate-fade-in">
                    <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem', fontWeight: '800' }}>
                        Master Any Topic with <span className="gradient-text">AI Power</span>
                    </h1>
                    <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '540px' }}>
                        The ultimate battleground for knowledge. Generate high-fidelity quizzes
                        with Groq AI and challenge your community in real-time.
                    </p>

                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                        <Link href="/register" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                            Start Your Battle
                        </Link>
                        <Link href="/rooms" className="btn btn-outline" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
                            Browse Arena
                        </Link>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '2.5rem' }}>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>10k+</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quizzes Created</div>
                        </div>
                        <div style={{ width: '1px', background: 'var(--border-subtle)' }}></div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>500+</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Battles</div>
                        </div>
                    </div>
                </div>

                <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        background: 'var(--primary)',
                        filter: 'blur(120px)',
                        opacity: '0.15',
                        zIndex: -1
                    }}></div>
                    <Image
                        src="/ai-robot.png"
                        alt="AI Quiz Mascot"
                        width={500}
                        height={500}
                        style={{ objectFit: 'contain', width: '100%', height: 'auto', maxWidth: '450px' }}
                        priority
                    />
                </div>
            </div>

            {/* Features Section - Bespoke Handcrafted Layout */}
            <div style={{ marginTop: '12rem', display: 'flex', flexDirection: 'column', gap: '12rem' }}>
                {/* Feature 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem', alignItems: 'center' }} className="animate-fade-in">
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '-20px',
                            width: '40px',
                            height: '40px',
                            borderLeft: '2px solid var(--primary)',
                            borderTop: '2px solid var(--primary)',
                            opacity: 0.3
                        }}></div>
                        <div style={{
                            display: 'inline-flex',
                            padding: '0.5rem 1rem',
                            background: 'rgba(129, 140, 248, 0.05)',
                            color: 'var(--primary)',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(129, 140, 248, 0.1)'
                        }}>
                            01. INTELLIGENCE
                        </div>
                        <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: '1.1', fontWeight: '800' }}>
                            Groq AI <br /><span className="gradient-text">Neural Engine</span>
                        </h2>
                        <p className="text-muted" style={{ fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '480px' }}>
                            Transcend standard quiz generation. Our integration with Llama 3.3
                            provides deep context analysis, ensuring questions are challenging,
                            accurate, and tailored to your specific topic in milliseconds.
                        </p>
                    </div>
                    <div className="card-clean" style={{
                        padding: '4rem',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'rgba(22, 26, 41, 0.4)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(129, 140, 248, 0.2)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5), inset 0 0 20px rgba(129,140,248,0.05)'
                    }}>
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', filter: 'drop-shadow(0 0 10px rgba(129,140,248,0.4))' }}>
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                    </div>
                </div>

                {/* Feature 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '6rem', alignItems: 'center' }} className="animate-fade-in">
                    <div className="card-clean" style={{
                        padding: '4rem',
                        display: 'flex',
                        justifyContent: 'center',
                        order: 1,
                        background: 'rgba(22, 26, 41, 0.4)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(192, 132, 252, 0.2)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5), inset 0 0 20px rgba(192,132,252,0.05)'
                    }}>
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 10px rgba(192,132,252,0.4))' }}>
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div style={{ order: 2, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '0.5rem 1rem',
                            background: 'rgba(192, 132, 252, 0.05)',
                            color: 'var(--accent)',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(192, 132, 252, 0.1)'
                        }}>
                            02. MULTIPLAYER
                        </div>
                        <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: '1.1', fontWeight: '800' }}>
                            Global <br /><span className="gradient-text">Battle Arena</span>
                        </h2>
                        <p className="text-muted" style={{ fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '480px' }}>
                            Don't just compete—dominate. Create private rooms with custom
                            access codes or join public matches to test your knowledge against
                            the best minds in the community, worldwide.
                        </p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '6rem', alignItems: 'center' }} className="animate-fade-in">
                    <div>
                        <div style={{
                            display: 'inline-flex',
                            padding: '0.5rem 1rem',
                            background: 'rgba(16, 185, 129, 0.05)',
                            color: '#10b981',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(16, 185, 129, 0.1)'
                        }}>
                            03. PERFORMANCE
                        </div>
                        <h2 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: '1.1', fontWeight: '800' }}>
                            Advanced <br /><span className="gradient-text">Analytics</span>
                        </h2>
                        <p className="text-muted" style={{ fontSize: '1.15rem', lineHeight: '1.8', maxWidth: '480px' }}>
                            Every battle is a data point. Track your progress with detailed
                            statistics, identify knowledge gaps, and watch your rank climb
                            as you master more complex topics.
                        </p>
                    </div>
                    <div className="card-clean" style={{
                        padding: '4rem',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'rgba(22, 26, 41, 0.4)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5), inset 0 0 20px rgba(16,185,129,0.05)'
                    }}>
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.4))' }}>
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                            <polyline points="16 7 22 7 22 13"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
