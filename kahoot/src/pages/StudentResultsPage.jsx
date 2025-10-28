import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, onValue } from 'firebase/database';
import SoundButton from '../components/SoundButton';
import { useThemeContext } from '../context/ThemeContext.jsx';

const StudentResultsPage = () => {
  const { gameSessionId } = useParams();
  const navigate = useNavigate();
  const { colorScheme } = useThemeContext();
  const playerId = sessionStorage.getItem('playerId');
  const [results, setResults] = useState(null);

  useEffect(() => {
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    const unsubscribe = onValue(gameSessionRef, (snapshot) => {
      const gameSession = snapshot.val();
      if (gameSession.status === 'waiting') {
        navigate(`/student-wait/${gameSessionId}`);
        return;
      }
      if (gameSession && gameSession.players) {
        const playersArray = Object.keys(gameSession.players).map(key => ({
          id: key,
          ...gameSession.players[key]
        }));
        playersArray.sort((a, b) => b.score - a.score);
        const playerIndex = playersArray.findIndex(p => p.id === playerId);
        const player = playersArray[playerIndex];

        if (player) {
          setResults({
            score: player.score,
            rank: playerIndex + 1,
            totalPlayers: playersArray.length,
            top5: playersArray.slice(0, 5),
          });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [gameSessionId, playerId]);

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colorScheme === 'dark'
        ? 'linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a0f1e 100%)'
        : 'linear-gradient(135deg, #fafbfc 0%, #f0f4f8 50%, #fafbfc 100%)',
      backgroundAttachment: 'fixed',
      padding: '3rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: colorScheme === 'dark'
          ? 'rgba(17, 24, 39, 0.4)'
          : 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: colorScheme === 'dark'
          ? '1px solid rgba(148, 163, 184, 0.15)'
          : '1px solid rgba(203, 213, 225, 0.3)',
        borderRadius: '24px',
        padding: '3rem 2rem',
        boxShadow: colorScheme === 'dark'
          ? '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(148, 163, 184, 0.05)'
          : '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Your Results</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>You finished {results.rank} out of {results.totalPlayers}!</h2>
        <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#6366f1' }}>Your final score: {results.score}</h3>

        <div style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h4 style={{ marginBottom: '1rem' }}>Top 5 Players:</h4>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {results.top5.map((player, index) => (
              <li key={index} style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                {index + 1}. {player.name} - {player.score}
              </li>
            ))}
          </ol>
        </div>

        <SoundButton onClick={() => navigate(`/student-wait/${gameSessionId}`)}>
          Return to Waiting Room
        </SoundButton>
      </div>
    </div>
  );
};

export default StudentResultsPage;
