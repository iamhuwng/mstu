import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, onValue, get, update, remove, set } from 'firebase/database';
import { Progress, Stack } from '@mantine/core';
import RocketRaceChart from '../components/RocketRaceChart';
import AnswerAggregationDisplay from '../components/AnswerAggregationDisplay';
import TeacherFooterBar from '../components/TeacherFooterBar';
import { useThemeContext } from '../context/ThemeContext.jsx';
import { Card, CardBody } from '../components/modern';
import { createTimerState, pauseTimer, resumeTimer } from '../hooks/useSynchronizedTimer';
// import { useLog } from '../context/LogContext'; // DISABLED FOR TESTING

const TeacherFeedbackPage = () => {
  const { gameSessionId } = useParams();
  const navigate = useNavigate();
  const { isAurora, colorScheme } = useThemeContext();
  // const { addLog } = useLog(); // DISABLED FOR TESTING
  const addLog = () => {}; // No-op function
  const [gameSession, setGameSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [correctStudents, setCorrectStudents] = useState([]);
  const [incorrectStudents, setIncorrectStudents] = useState([]);
  const [fastestCorrect, setFastestCorrect] = useState(null);
  const [slowestOrNoAnswer, setSlowestOrNoAnswer] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const pausedTimeRef = useRef(null);
  const remainingTimeRef = useRef(5000);

  // Fetch game session data
  useEffect(() => {
    addLog(`[TEACHER FEEDBACK] Component mounted for session: ${gameSessionId}`);
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    const unsubscribe = onValue(gameSessionRef, (snapshot) => {
      const data = snapshot.val();
      addLog(`[TEACHER FEEDBACK] Game session updated: status=${data?.status}, currentQuestionIndex=${data?.currentQuestionIndex}`);
      setGameSession(data);
    });

    return () => {
      addLog(`[TEACHER FEEDBACK] Component unmounting`);
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameSessionId, addLog]);

  // Load quiz data once when gameSession.quizId is available
  useEffect(() => {
    if (gameSession && gameSession.quizId && !quiz) {
      addLog(`[TEACHER FEEDBACK] Loading quiz data for quizId: ${gameSession.quizId}`);
      const quizRef = ref(database, `quizzes/${gameSession.quizId}`);
      get(quizRef).then((quizSnapshot) => {
        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.val();
          addLog(`[TEACHER FEEDBACK] Quiz loaded: ${quizData.questions?.length || 0} questions`);
          setQuiz(quizData);
        } else {
          addLog(`[TEACHER FEEDBACK] ❌ Quiz not found in database`);
          console.error('❌ Quiz not found in database');
        }
      });
    }
  }, [gameSession, quiz, addLog]);

  useEffect(() => {
    if (gameSession?.status === 'in-progress') {
      addLog(`[TEACHER FEEDBACK] Status changed to in-progress, navigating to quiz page`);
      navigate(`/teacher-quiz/${gameSessionId}`);
    }
  }, [gameSession?.status, gameSession?.currentQuestionIndex, navigate, gameSessionId, addLog]);

  // Sync local pause state with gameSession timer state
  useEffect(() => {
    if (gameSession?.timer?.isPaused !== undefined) {
      setIsPaused(gameSession.timer.isPaused);
    }
  }, [gameSession?.timer?.isPaused]);

  const currentQuestionIndex = gameSession?.currentQuestionIndex || 0;

  // Calculate correct/incorrect student lists and fastest/slowest responders
  useEffect(() => {
    if (!gameSession || !quiz || !gameSession.players) return;

    const correct = [];
    const incorrect = [];
    const correctWithTime = [];
    const allWithTime = [];

    Object.entries(gameSession.players).forEach(([playerId, player]) => {
      if (player.answers && player.answers[currentQuestionIndex]) {
        const answer = player.answers[currentQuestionIndex];
        if (answer.isCorrect) {
          correct.push(player.name);
          correctWithTime.push({ name: player.name, time: answer.timeSpent || 0 });
        } else {
          incorrect.push(player.name);
        }
        allWithTime.push({ name: player.name, time: answer.timeSpent || 0, hasAnswer: true });
      } else {
        // No answer submitted = incorrect
        incorrect.push(player.name);
        allWithTime.push({ name: player.name, time: null, hasAnswer: false });
      }
    });

    setCorrectStudents(correct);
    setIncorrectStudents(incorrect);

    // Find fastest correct answer
    if (correctWithTime.length > 0) {
      const fastest = correctWithTime.reduce((prev, curr) => 
        (curr.time < prev.time) ? curr : prev
      );
      setFastestCorrect(fastest);
    } else {
      setFastestCorrect(null);
    }

    // Find slowest or no answer
    const noAnswers = allWithTime.filter(p => !p.hasAnswer);
    if (noAnswers.length > 0) {
      // Prioritize showing someone who didn't answer
      setSlowestOrNoAnswer({ name: noAnswers[0].name, time: null });
    } else if (allWithTime.length > 0) {
      // Show slowest responder
      const slowest = allWithTime.reduce((prev, curr) => 
        (curr.time > prev.time) ? curr : prev
      );
      setSlowestOrNoAnswer(slowest);
    } else {
      setSlowestOrNoAnswer(null);
    }
  }, [gameSession, quiz, currentQuestionIndex]);

  // Auto-advance countdown with pause support
  useEffect(() => {
    console.log('Auto-advance useEffect triggered', { 
      status: gameSession?.status, 
      hasQuiz: !!quiz, 
      hasGameSession: !!gameSession,
      isPaused 
    });
    
    if (gameSession?.status === 'feedback' && quiz && gameSession) {
      // Reset countdown and remaining time when entering feedback
      setCountdown(5);
      remainingTimeRef.current = 5000;
      pausedTimeRef.current = null;

      // Start countdown interval
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setCountdown((prev) => {
            const newCount = Math.max(0, prev - 1);
            remainingTimeRef.current = newCount * 1000;
            return newCount;
          });
        }
      }, 1000);

      // Set timeout for auto-advance
      timeoutRef.current = setTimeout(() => {
        if (!isPaused) {
          console.log('Timeout fired, calling handleAutoAdvance');
          
          // Find next non-hidden question
          const currentIdx = gameSession.currentQuestionIndex || 0;
          let nextIndex = currentIdx + 1;
          while (nextIndex < quiz.questions.length && quiz.questions[nextIndex]?.hidden) {
            nextIndex++;
          }

          // If no more visible questions, go to results
          if (nextIndex >= quiz.questions.length) {
            const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
            update(gameSessionRef, {
              status: 'results'
            }).then(() => {
              navigate(`/teacher-results/${gameSessionId}`);
            });
          } else {
            // Move to next visible question
            const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
            const nextQuestion = quiz.questions[nextIndex];
            const timerState = createTimerState(nextQuestion.timer || 0);
            
            update(gameSessionRef, {
              currentQuestionIndex: nextIndex,
              status: 'in-progress',
              timer: timerState
            });
          }
        }
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameSession?.status, quiz, gameSession, gameSessionId, navigate, isPaused]);

  // Handle pause/resume for countdown
  useEffect(() => {
    if (gameSession?.status !== 'feedback') return;

    if (isPaused) {
      // Pause: clear timers and save remaining time
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      pausedTimeRef.current = Date.now();
    } else if (pausedTimeRef.current !== null) {
      // Resume: restart timers with remaining time
      const pauseDuration = Date.now() - pausedTimeRef.current;
      const adjustedRemaining = Math.max(0, remainingTimeRef.current);
      
      // Restart countdown interval
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setCountdown((prev) => {
            const newCount = Math.max(0, prev - 1);
            remainingTimeRef.current = newCount * 1000;
            return newCount;
          });
        }
      }, 1000);

      // Restart auto-advance timeout with remaining time
      if (adjustedRemaining > 0) {
        timeoutRef.current = setTimeout(() => {
          if (!isPaused && quiz && gameSession) {
            console.log('Timeout fired after resume');
            
            // Find next non-hidden question
            const currentIdx = gameSession.currentQuestionIndex || 0;
            let nextIndex = currentIdx + 1;
            while (nextIndex < quiz.questions.length && quiz.questions[nextIndex]?.hidden) {
              nextIndex++;
            }

            // If no more visible questions, go to results
            if (nextIndex >= quiz.questions.length) {
              const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
              update(gameSessionRef, {
                status: 'results'
              }).then(() => {
                navigate(`/teacher-results/${gameSessionId}`);
              });
            } else {
              // Move to next visible question
              const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
              const nextQuestion = quiz.questions[nextIndex];
              const timerState = createTimerState(nextQuestion.timer || 0);
              
              update(gameSessionRef, {
                currentQuestionIndex: nextIndex,
                status: 'in-progress',
                timer: timerState
              });
            }
          }
        }, adjustedRemaining);
      }

      pausedTimeRef.current = null;
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, gameSession?.status, quiz, gameSession, gameSessionId, navigate]);

  const handleAutoAdvance = () => {
    console.log('handleAutoAdvance called');
    if (!gameSession || !quiz) return;

    // Find next non-hidden question
    let nextIndex = currentQuestionIndex + 1;
    while (nextIndex < quiz.questions.length && quiz.questions[nextIndex]?.hidden) {
      nextIndex++;
    }

    // If no more visible questions, go to results
    if (nextIndex >= quiz.questions.length) {
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      update(gameSessionRef, {
        status: 'results'
      }).then(() => {
        navigate(`/teacher-results/${gameSessionId}`);
      });
    } else {
      // Move to next visible question
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      const nextQuestion = quiz.questions[nextIndex];
      const timerState = createTimerState(nextQuestion.timer || 0);
      
      update(gameSessionRef, {
        currentQuestionIndex: nextIndex,
        status: 'in-progress',
        timer: timerState  // Create PAUSED timer state to prevent immediate expiry
      });
    }
  };

  const handleNextQuestion = () => {
    // Clear timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (!gameSession || !quiz) return;

    // Find next non-hidden question
    let nextIndex = currentQuestionIndex + 1;
    while (nextIndex < quiz.questions.length && quiz.questions[nextIndex]?.hidden) {
      nextIndex++;
    }

    // If no more visible questions, go to results
    if (nextIndex >= quiz.questions.length) {
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      update(gameSessionRef, {
        status: 'results'
      }).then(() => {
        navigate(`/teacher-results/${gameSessionId}`);
      });
    } else {
      // Move to next visible question
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      const nextQuestion = quiz.questions[nextIndex];
      const timerState = createTimerState(nextQuestion.timer || 0);
      
      update(gameSessionRef, {
        currentQuestionIndex: nextIndex,
        status: 'in-progress',
        timer: timerState // Start timer automatically
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (gameSession && quiz) {
      if (currentQuestionIndex > 0) {
        // Clear timers
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);

        const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
        const prevQuestion = quiz.questions[currentQuestionIndex - 1];
        const timerState = createTimerState(prevQuestion.timer || 0);
        const pausedTimerState = pauseTimer(timerState);
        
        update(gameSessionRef, {
          currentQuestionIndex: currentQuestionIndex - 1,
          status: 'in-progress',
          timer: pausedTimerState
        });
      }
    }
  };

  const handlePause = () => {
    if (!gameSession || !gameSession.timer) return;
    
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    const currentTimer = gameSession.timer;
    
    if (currentTimer.isPaused) {
      // Resume timer
      const resumedTimer = resumeTimer(currentTimer);
      update(gameSessionRef, { timer: resumedTimer });
    } else {
      // Pause timer
      const pausedTimerState = pauseTimer(currentTimer);
      update(gameSessionRef, { timer: pausedTimerState });
    }
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to end this quiz session? All students will be redirected to the waiting room.')) {
      // Clear timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      
      // Keep players but reset their scores and answers
      const resetPlayers = {};
      if (gameSession?.players) {
        Object.keys(gameSession.players).forEach(playerId => {
          resetPlayers[playerId] = {
            name: gameSession.players[playerId].name,
            ip: gameSession.players[playerId].ip || 'unknown',
            score: 0,
            answers: {}
          };
        });
      }
      
      update(gameSessionRef, {
        status: 'waiting',
        players: resetPlayers,
        currentQuestionIndex: 0,
        timer: null  // Clear timer state to prevent auto-start
      }).then(() => {
        navigate('/lobby');
      });
    }
  };

  const handleKickPlayer = (playerId) => {
    if (window.confirm('Are you sure you want to kick this player?')) {
      const player = gameSession.players[playerId];
      if (player) {
        // Always ban by player ID, and also by IP if known
        const bannedPlayerRef = ref(database, `game_sessions/${gameSessionId}/bannedPlayers/${playerId}`);
        set(bannedPlayerRef, {
          name: player.name,
          ip: player.ip || 'unknown',
          bannedAt: Date.now(),
        });

        // Show appropriate message
        if (!player.ip || player.ip === 'unknown') {
          alert(`Player "${player.name}" has been kicked and banned by ID. They cannot rejoin with the same browser, but may be able to rejoin from a different device.`);
        }

        // Always remove the player from the active session
        const playerRef = ref(database, `game_sessions/${gameSessionId}/players/${playerId}`);
        remove(playerRef);
      }
    }
  };

  const handleUnbanPlayer = (playerId) => {
    const bannedPlayerRef = ref(database, `game_sessions/${gameSessionId}/bannedPlayers/${playerId}`);
    remove(bannedPlayerRef);
  };

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this session? This will return all players to the waiting room.')) {
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      
      // Keep players but reset their scores and answers
      const resetPlayers = {};
      if (gameSession?.players) {
        Object.keys(gameSession.players).forEach(playerId => {
          resetPlayers[playerId] = {
            name: gameSession.players[playerId].name,
            ip: gameSession.players[playerId].ip || 'unknown',
            score: 0,
            answers: {}
          };
        });
      }
      
      update(gameSessionRef, {
        status: 'waiting',
        players: resetPlayers,
        currentQuestionIndex: 0,
        timer: null  // Clear timer state to prevent auto-start
      }).then(() => {
        navigate('/lobby');
      });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  const handleJumpToQuestion = (index) => {
    if (gameSession && quiz) {
      // Clear timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      const jumpQuestion = quiz.questions[index];
      const timerState = createTimerState(jumpQuestion.timer || 0);
      const pausedTimerState = pauseTimer(timerState);
      
      update(gameSessionRef, {
        currentQuestionIndex: index,
        status: 'in-progress',
        timer: pausedTimerState
      });
    }
  };

  if (!gameSession || !quiz) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const playerCount = gameSession.players ? Object.keys(gameSession.players).length : 0;

  // Format correct answer display
  const correctAnswerDisplay = Array.isArray(currentQuestion.answer)
    ? currentQuestion.answer.join(', ')
    : currentQuestion.answer;

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 25%, #f0fdfa 50%, #fff7ed 75%, #faf5ff 100%)',
    backgroundAttachment: 'fixed',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: '70px'
  };

  const scrollRegionStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: 'clamp(0.5rem, 1vw, 1rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    minHeight: 0
  };

  const stackStyle = {
    width: '100%',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0
  };

  const titleComponent = (
    <Card variant="lavender" style={{ padding: 'clamp(0.5rem, 1.5vw, 1rem)', textAlign: 'center', flexShrink: 0 }}>
      <CardBody>
        <h2 style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          marginBottom: 'clamp(0.375rem, 1vw, 0.75rem)'
        }}>
          Question {currentQuestionIndex + 1} Results
        </h2>
        <Progress
          value={(countdown / 5) * 100}
          size="sm"
          color={countdown <= 2 ? 'red' : countdown <= 3 ? 'yellow' : 'blue'}
          animated
          striped
        />
      </CardBody>
    </Card>
  );


  const answerCard = (
    <Card variant="mint" style={{ padding: 'clamp(0.75rem, 2vw, 1.5rem)', flexShrink: 0 }}>
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
          <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', fontWeight: '600', color: '#14b8a6', margin: 0 }}>
            ✓ Correct Answer
          </p>
          <p style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.75rem)', fontWeight: '700', color: '#1e293b', margin: 0, wordBreak: 'break-word' }}>
            {correctAnswerDisplay}
          </p>
        </div>
      </CardBody>
    </Card>
  );

  const speedCard = (
    <Card variant="sky" style={{ padding: 'clamp(0.75rem, 2vw, 1.5rem)', flexShrink: 0, marginTop: 'clamp(0.5rem, 1vw, 0.75rem)' }}>
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem, 1.5vw, 1rem)' }}>
          {/* Fastest Correct */}
          <div>
            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '600', color: '#0ea5e9', margin: 0, marginBottom: 'clamp(0.25rem, 0.5vw, 0.375rem)' }}>
              ⚡ Fastest Correct
            </p>
            {fastestCorrect ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 'clamp(0.875rem, 1.75vw, 1.125rem)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                  {fastestCorrect.name}
                </p>
                <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '600', color: '#0ea5e9', margin: 0 }}>
                  {fastestCorrect.time.toFixed(1)}s
                </p>
              </div>
            ) : (
              <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                No correct answers
              </p>
            )}
          </div>
          
          {/* Slowest or No Answer */}
          <div>
            <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '600', color: '#f43f5e', margin: 0, marginBottom: 'clamp(0.25rem, 0.5vw, 0.375rem)' }}>
              🐌 {slowestOrNoAnswer?.time === null ? 'No Answer' : 'Slowest Response'}
            </p>
            {slowestOrNoAnswer ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 'clamp(0.875rem, 1.75vw, 1.125rem)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                  {slowestOrNoAnswer.name}
                </p>
                {slowestOrNoAnswer.time !== null && (
                  <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '600', color: '#f43f5e', margin: 0 }}>
                    {slowestOrNoAnswer.time.toFixed(1)}s
                  </p>
                )}
              </div>
            ) : (
              <p style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                No players
              </p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );



  return (
    <div style={pageStyle}>
      <div style={scrollRegionStyle}>
        <div style={stackStyle}>
          {titleComponent}
          <div style={{ 
            flex: 1, 
            minHeight: 0, 
            display: 'flex', 
            gap: 'clamp(0.5rem, 1vw, 1rem)',
            marginTop: 'clamp(0.5rem, 1vw, 0.75rem)'
          }}>
            <div style={{ 
              flex: 2, 
              minWidth: 0, 
              minHeight: 0,
              display: 'flex', 
              flexDirection: 'column'
            }}>
              <RocketRaceChart players={gameSession.players} />
            </div>
            <div style={{ 
              flex: 1, 
              minWidth: 0,
              minHeight: 0,
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'auto'
            }}>
              {answerCard}
              {speedCard}
            </div>
          </div>
        </div>
      </div>

      <TeacherFooterBar
        playerCount={playerCount}
        timerState={gameSession.timer}
        canGoPrevious={!isFirstQuestion}
        isFirstQuestion={isFirstQuestion}
        onBackClick={handleBack}
        onPreviousClick={handlePreviousQuestion}
        onPauseResumeClick={handlePause}
        onNextClick={handleNextQuestion}
        onLogoutClick={handleLogout}
        questions={Array.isArray(quiz.questions) ? quiz.questions : []}
        onJumpToQuestion={handleJumpToQuestion}
        currentQuestionIndex={currentQuestionIndex}
        players={gameSession.players}
        bannedPlayers={gameSession.bannedPlayers}
        onKickPlayer={handleKickPlayer}
        onUnbanPlayer={handleUnbanPlayer}
        onEndSessionClick={handleEndSession}
      />
    </div>
  );
}
;

export default TeacherFeedbackPage;