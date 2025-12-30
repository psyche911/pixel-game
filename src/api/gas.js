import axios from 'axios';

const GAS_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
const MOCK_MODE = !GAS_URL || GAS_URL.includes('MockUrl'); // Mock if missing or placeholder

const mockQuestions = [
  { id: 1, title: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], answer: 'Paris' },
  { id: 2, title: 'Which pixel art game features a farmer?', options: ['Stardew Valley', 'Minecraft', 'Terraria', 'Celeste'], answer: 'Stardew Valley' },
  { id: 3, title: 'What color is Mario\'s hat?', options: ['Green', 'Red', 'Blue', 'Yellow'], answer: 'Red' },
  { id: 4, title: 'Which company created the Game Boy?', options: ['Sony', 'Sega', 'Nintendo', 'Atari'], answer: 'Nintendo' },
  { id: 5, title: 'What is the main character in Zelda?', options: ['Zelda', 'Link', 'Ganon', 'Epona'], answer: 'Link' },
];

export const fetchQuestions = async (count) => {
  if (MOCK_MODE) {
    console.log('Fetching mock questions...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockQuestions.slice(0, count));
      }, 1000);
    });
  }

  try {
    const response = await axios.get(`${GAS_URL}?action=getQuestions&count=${count}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const submitScore = async (data) => {
  // data: { id, score, pass }
  if (MOCK_MODE) {
    console.log('Submitting mock score:', data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Score saved (Mock)' });
      }, 1000);
    });
  }

  try {
    // Google Apps Script usually requires POST data as text/plain or specific config to avoid CORS preflight issues sometimes,
    // but standard axios POST should work if GAS handles OPTIONS. 
    // Often for simple GAS webapps, a custom payload string is easier, but let's try standard JSON.
    const response = await axios.post(GAS_URL, data, {
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // GAS often works better with text/plain to avoid CORS preflight options
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
};
