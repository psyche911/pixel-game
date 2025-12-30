import React, { useEffect, useMemo } from 'react';
import useGameStore from '../store/gameStore';
import { PixelCard, Avatar, ProgressBar } from '../components/Common';
import { masterImages } from '../utils/imageLoader';

const Game = () => {
    const { questions, currentQuestionIndex, answerQuestion, score } = useGameStore();

    const question = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Select a consistent avatar for this question based on index or question ID
    const avatarUrl = useMemo(() => {
        // Pick a random image from our preloaded list, but consistent for the question index
        // We use modulo to wrap around if we have more questions than images (unlikely with 100 images)
        return masterImages[currentQuestionIndex % masterImages.length];
    }, [currentQuestionIndex]);

    if (!question) return <div>Loading Question...</div>;

    return (
        <div>
            <ProgressBar current={currentQuestionIndex + 1} max={totalQuestions} />

            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                <Avatar src={avatarUrl} />
            </div>

            <PixelCard title={`Q${currentQuestionIndex + 1}: The Master Asks`}>
                <p style={{ minHeight: '60px', marginBottom: '2rem' }}>{question.title}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            className="nes-btn"
                            onClick={() => answerQuestion(opt)}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </PixelCard>

            <p className="text-right">Score: {score}</p>
        </div>
    );
};

export default Game;
