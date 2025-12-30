import React, { useEffect } from 'react';
import useGameStore from './store/gameStore';
import Home from './pages/Home';
import Game from './pages/Game';
import Result from './pages/Result';
import { preloadImages, masterImages } from './utils/imageLoader';

function App() {
  const { gameState } = useGameStore();

  useEffect(() => {
    // Preload images in background
    console.log("Preloading images...");
    preloadImages(masterImages).then(() => console.log("Images preloaded"));
  }, []);

  return (
    <div className="App">
      {gameState === 'idle' && <Home />}
      {gameState === 'loading' && (
        <div style={{ textAlign: 'center' }}>
          <p className="blink">LOADING DATA...</p>
          <progress className="nes-progress is-primary" value="50" max="100"></progress>
        </div>
      )}
      {gameState === 'playing' && <Game />}
      {(gameState === 'finished' || gameState === 'saving') && (
        gameState === 'saving' ? (
          <div style={{ textAlign: 'center' }}>
            <p className="blink">SAVING SCORE...</p>
          </div>
        ) : <Result />
      )}
    </div>
  );
}

export default App;
