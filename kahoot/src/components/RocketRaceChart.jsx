import React, { useMemo, useState, useEffect } from 'react';
import { Paper, Text, Group, Box } from '@mantine/core';
import './RocketRaceChart.css';

const RocketRaceChart = ({ players }) => {
  const [prevScores, setPrevScores] = useState({});
  const [floatingScores, setFloatingScores] = useState({});

  const playersArray = useMemo(() => {
    if (!players) return [];
    return Object.values(players).sort((a, b) => b.score - a.score);
  }, [players]);

  // Calculate correct answer streak for each player
  const getStreak = (player) => {
    if (!player.answers) return 0;
    const answerIndices = Object.keys(player.answers).map(Number).sort((a, b) => b - a);
    let streak = 0;
    for (const idx of answerIndices) {
      if (player.answers[idx]?.isCorrect) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Count total correct answers for each player
  const getCorrectCount = (player) => {
    if (!player.answers) return 0;
    return Object.values(player.answers).filter(a => a?.isCorrect).length;
  };

  // Track score changes and show floating animation
  useEffect(() => {
    if (!players) return;

    const newFloatingScores = {};
    Object.entries(players).forEach(([id, player]) => {
      const currentScore = player.score || 0;
      const previousScore = prevScores[id] || 0;
      
      if (currentScore > previousScore) {
        const scoreDiff = currentScore - previousScore;
        newFloatingScores[id] = {
          value: scoreDiff,
          timestamp: Date.now()
        };
      }
    });

    if (Object.keys(newFloatingScores).length > 0) {
      setFloatingScores(newFloatingScores);
      
      // Remove floating scores after animation
      setTimeout(() => {
        setFloatingScores({});
      }, 2000);
    }

    // Update previous scores
    const newPrevScores = {};
    Object.entries(players).forEach(([id, player]) => {
      newPrevScores[id] = player.score || 0;
    });
    setPrevScores(newPrevScores);
  }, [players]);

  // Calculate position based on correct answers + streak bonus
  const getPosition = (player) => {
    const correctCount = getCorrectCount(player);
    const streak = getStreak(player);
    
    if (correctCount === 0) return 0; // Start at ground
    
    // Base height: 15% per correct answer
    let height = correctCount * 15;
    
    // Streak bonus: +5% per streak level
    if (streak >= 2) height += (streak - 1) * 5;
    
    // Cap at 90% to keep visible
    return Math.min(height, 90);
  };

  const isLeader = (index) => index === 0 && playersArray.length > 1;

  return (
    <Paper
      p="xl"
      radius="md"
      className="rocket-race-container"
      style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 50%, #2a1f3a 100%)',
        position: 'relative',
        overflow: 'auto',
        height: '100%',
        minHeight: '200px',
      }}
    >
      {/* Animated stars background */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Title */}
      <Text
        size="xl"
        fw={700}
        mb="xl"
        style={{
          color: '#fff',
          textAlign: 'center',
          textShadow: '0 0 10px rgba(255,255,255,0.5)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        🚀 Rocket Race 🚀
      </Text>

      {/* Race tracks - Vertical orientation */}
      <Box style={{ 
        position: 'relative', 
        zIndex: 5,
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: 'calc(100% - 80px)',
        paddingBottom: '20px'
      }}>
        {playersArray.map((player, index) => {
          const position = getPosition(player);
          const leader = isLeader(index);
          const streak = getStreak(player);
          const correctCount = getCorrectCount(player);
          const playerId = Object.keys(players).find(id => players[id].name === player.name);
          const floatingScore = floatingScores[playerId];
          
          // Fire size based on streak (0 = no fire, 1-2 = small, 3-4 = medium, 5+ = large)
          const getFireSize = () => {
            if (streak === 0) return 0;
            if (streak <= 2) return 1.2;
            if (streak <= 4) return 1.8;
            return 2.5;
          };
          const fireSize = getFireSize();

          return (
            <div
              key={player.name || index}
              className="race-track"
              style={{
                position: 'relative',
                width: '80px',
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Container for rocket positioning */}
              <div
                style={{
                  width: '2px',
                  height: '100%',
                  minHeight: '300px',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >

                {/* Rocket - Flying up from bottom */}
                <div
                  className={`rocket ${leader ? 'rocket-leader' : ''}`}
                  style={{
                    position: 'absolute',
                    bottom: `${position}%`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    transition: 'bottom 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0px',
                  }}
                >
                  {/* Rocket emoji */}
                  <div style={{
                    fontSize: leader ? '2.5rem' : '2rem',
                    filter: leader ? 'drop-shadow(0 0 10px #ffd700)' : 'none',
                    position: 'relative',
                  }}>
                    🚀
                    {/* Points display on rocket */}
                    <span style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      color: leader ? '#ffd700' : '#4dabf7',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      zIndex: 10
                    }}>
                      {player.score || 0}
                    </span>
                  </div>
                  
                  {/* Rocket exhaust flame - grows with streak */}
                  {streak > 0 && (
                    <div 
                      className="rocket-exhaust"
                      style={{ 
                        width: '30px',
                        height: `${fireSize * 20}px`,
                        background: 'linear-gradient(to bottom, rgba(255, 100, 0, 0.9) 0%, rgba(255, 200, 0, 0.7) 50%, rgba(255, 255, 100, 0.3) 100%)',
                        borderRadius: '50% 50% 0 0',
                        marginTop: '-5px',
                        filter: 'blur(2px)',
                        position: 'relative'
                      }}
                    >
                      {/* Inner bright core */}
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '15px',
                        height: `${fireSize * 15}px`,
                        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 200, 100, 0.6) 100%)',
                        borderRadius: '50% 50% 0 0',
                        filter: 'blur(1px)'
                      }} />
                    </div>
                  )}
                  
                  {/* Particle trail - only when moving */}
                  {position > 5 && (
                    <div className="rocket-trail" style={{ 
                      position: 'absolute',
                      left: '100%',
                      top: '30%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      gap: '8px',
                      marginLeft: '8px'
                    }}>
                      <span className="particle">✨</span>
                      <span className="particle">✨</span>
                      <span className="particle">✨</span>
                    </div>
                  )}
                </div>

                {/* Floating score animation */}
                {floatingScore && (
                  <div
                    className="floating-score"
                    style={{
                      position: 'absolute',
                      bottom: `${position}%`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#4ade80',
                      textShadow: '0 0 10px rgba(74, 222, 128, 0.8)',
                      animation: 'floatUp 2s ease-out forwards',
                      pointerEvents: 'none',
                      zIndex: 20
                    }}
                  >
                    +{floatingScore.value}
                  </div>
                )}
              </div>

              {/* Player info - Below track (name only) */}
              <div style={{ marginTop: '10px', textAlign: 'center', width: '100%' }}>
                <Text
                  size="xs"
                  fw={leader ? 700 : 500}
                  style={{
                    color: leader ? '#ffd700' : '#fff',
                    textShadow: leader ? '0 0 5px rgba(255,215,0,0.5)' : 'none',
                    wordBreak: 'break-word',
                  }}
                >
                  {leader && '👑'}
                  {player.name}
                </Text>
              </div>
            </div>
          );
        })}
      </Box>

      {/* No players message */}
      {playersArray.length === 0 && (
        <Text
          ta="center"
          c="dimmed"
          size="lg"
          style={{
            color: 'rgba(255,255,255,0.5)',
            marginTop: '60px',
          }}
        >
          Waiting for players to join the race...
        </Text>
      )}
    </Paper>
  );
};

export default RocketRaceChart;
