import React from 'react';
import useGameStore from '../store/gameStore';
import { PixelCard, Avatar } from '../components/Common';

const Result = () => {
    const { score, questions, resetGame, error } = useGameStore();
    const total = questions.length;
    const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3');
    const passed = score >= passThreshold;

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <i className={`nes-icon is-large ${passed ? 'trophy' : 'close'}`}></i>
            </div>

            <PixelCard title={passed ? "MISSION COMPLETE" : "GAME OVER"} className={passed ? "is-dark" : ""}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {passed ? (
                        <Avatar src="https://api.dicebear.com/9.x/pixel-art/svg?seed=winner" />
                    ) : (
                        <Avatar src="https://api.dicebear.com/9.x/pixel-art/svg?seed=loser" />
                    )}
                </div>

                <h2>Score: {score} / {total}</h2>

                <p style={{ margin: '2rem 0' }}>
                    {passed
                        ? "Congratulations! You have proven your worth."
                        : "The Master is unimpressed. Train harder!"}
                </p>

                {error && (
                    <div className="nes-text is-error">
                        Note: {error}
                    </div>
                )}

                <button className={`nes-btn ${passed ? 'is-success' : 'is-error'}`} onClick={resetGame}>
                    TRY AGAIN
                </button>
            </PixelCard>
        </div>
    );
};

export default Result;
