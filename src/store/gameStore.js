import { create } from 'zustand';
import { fetchQuestions, submitScore } from '../api/gas';

const useGameStore = create((set, get) => ({
    gameState: 'idle', // idle, loading, playing, finished
    userId: '',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answers: [], // Record of user answers
    error: null,

    setUserId: (id) => set({ userId: id }),

    startGame: async () => {
        const count = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5');
        set({ gameState: 'loading', error: null, score: 0, currentQuestionIndex: 0, answers: [] });
        try {
            const questions = await fetchQuestions(count);
            set({ questions, gameState: 'playing' });
        } catch (err) {
            let errorMsg = 'Failed to load questions.';
            const url = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || '';

            if (url.includes('/dev')) {
                errorMsg += ' (You are using a Test Deployment URL ending in /dev. Please use the Web App URL ending in /exec)';
            } else if (err.message === 'Network Error') {
                errorMsg += ' (CORS Error: Ensure "Who has access" is set to "Anyone" in your GAS deployment)';
            } else {
                errorMsg += ` ${err.message}`;
            }
            set({ gameState: 'idle', error: errorMsg });
        }
    },

    answerQuestion: (selectedOption) => {
        const { questions, currentQuestionIndex, score, answers } = get();
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = currentQuestion.answer === selectedOption;

        const newScore = isCorrect ? score + 1 : score;
        const newAnswers = [...answers, { questionId: currentQuestion.id, selected: selectedOption, correct: isCorrect }];

        set({ score: newScore, answers: newAnswers });

        // Move to next question or finish
        if (currentQuestionIndex + 1 < questions.length) {
            set({ currentQuestionIndex: currentQuestionIndex + 1 });
        } else {
            get().finishGame();
        }
    },

    finishGame: async () => {
        const { userId, score, answers, questions } = get();
        set({ gameState: 'saving' }); // distinctive state for async save

        const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3');
        const passed = score >= passThreshold;

        try {
            await submitScore({
                id: userId,
                score: score,
                passed: passed,
                totalQuestions: questions.length
            });
            set({ gameState: 'finished' });
        } catch (err) {
            // Even if save fails, we show results
            console.error("Failed to save score");
            set({ gameState: 'finished', error: 'Could not save score online, but here are your results.' });
        }
    },

    resetGame: () => {
        set({ gameState: 'idle', currentQuestionIndex: 0, score: 0, answers: [], questions: [] });
    }

}));

export default useGameStore;
