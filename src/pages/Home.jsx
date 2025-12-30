import React, { useState } from 'react';
import useGameStore from '../store/gameStore';

const Home = () => {
    const [inputVal, setInputVal] = useState('');
    const { setUserId, startGame, error } = useGameStore();

    const handleStart = () => {
        if (!inputVal.trim()) {
            alert('Please enter an ID to start!');
            return;
        }
        setUserId(inputVal.trim());
        startGame();
    };

    return (
        <div className="text-center">
            <div style={{ marginBottom: '2rem' }}>
                <i className="nes-icon is-large star"></i>
                <i className="nes-icon is-large star"></i>
                <i className="nes-icon is-large star"></i>
            </div>

            <h1>PIXEL QUIZ</h1>
            <p>Enter your ID to challenge the master!</p>

            <div className="nes-field is-inline" style={{ justifyContent: 'center', margin: '2rem 0' }}>
                <input
                    type="text"
                    id="name_field"
                    className="nes-input"
                    placeholder="Enter ID..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    style={{ maxWidth: '300px' }}
                />
            </div>

            {error && <div className="nes-text is-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <button type="button" className="nes-btn is-primary" onClick={handleStart}>
                PRESS START
            </button>

            <div style={{ marginTop: '4rem', opacity: 0.6 }}>
                <p>POWERED BY VITE & GOOGLE SHEETS</p>
            </div>
        </div>
    );
};

export default Home;
