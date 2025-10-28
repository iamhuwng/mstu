import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, onValue, update, remove, get, set, serverTimestamp } from 'firebase/database';
import { Center, Loader, Text } from '@mantine/core';
import RocketRaceChart from '../components/RocketRaceChart';
import QuestionRenderer from '../components/QuestionRenderer';
import TeacherFooterBar from '../components/TeacherFooterBar';
import CollapsiblePassagePanel from '../components/CollapsiblePassagePanel';
import { useThemeContext } from '../context/ThemeContext.jsx';
import { Card, CardBody } from '../components/modern';
import { createTimerState, pauseTimer, resumeTimer } from '../hooks/useSynchronizedTimer';
// import { useLog } from '../context/LogContext'; // DISABLED FOR TESTING

const TeacherQuizPage = () => {
  const { gameSessionId } = useParams();
  const navigate = useNavigate();
  const { isAurora, colorScheme } = useThemeContext();
  // const { addLog } = useLog(); // DISABLED FOR TESTING
  const addLog = () => {}; // No-op function
  const [gameSession, setGameSession] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    addLog(`[TEACHER QUIZ] Component mounted for session: ${gameSessionId}`);
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    const unsubscribe = onValue(gameSessionRef, (snapshot) => {
      const data = snapshot.val();
      addLog(`[TEACHER QUIZ] Game session updated: status=${data?.status}, currentQuestionIndex=${data?.currentQuestionIndex}, timer=${JSON.stringify(data?.timer)}`);
      setGameSession(data);
    });

    return () => {
      addLog(`[TEACHER QUIZ] Component unmounting`);
      unsubscribe();
    };
  }, [gameSessionId, addLog]);

  // Load quiz data once when gameSession.quizId is available
  useEffect(() => {
    if (gameSession && gameSession.quizId && !quiz) {
      addLog(`[TEACHER QUIZ] Loading quiz data for quizId: ${gameSession.quizId}`);
      const quizRef = ref(database, `quizzes/${gameSession.quizId}`);
      get(quizRef).then((quizSnapshot) => {
        if (quizSnapshot.exists()) {
          const quizData = quizSnapshot.val();
          addLog(`[TEACHER QUIZ] Quiz loaded: ${quizData.questions?.length || 0} questions`);
          setQuiz(quizData);
        } else {
          addLog(`[TEACHER QUIZ] ❌ Quiz not found in database`);
          console.error('❌ Quiz not found in database');
        }
      });
    }
  }, [gameSession, quiz, addLog]);

  const currentQuestionIndex = gameSession?.currentQuestionIndex ?? 0;
  const hasQuestions = Array.isArray(quiz?.questions) && quiz.questions.length > 0;
  
  // Filter out hidden questions
  const visibleQuestions = hasQuestions ? quiz.questions.filter(q => !q.hidden) : [];

  useEffect(() => {
    addLog(`[TEACHER QUIZ] Status check: status=${gameSession?.status}, hasQuiz=${!!quiz}, hasQuestions=${hasQuestions}`);
    console.log('useEffect for feedback called with status:', gameSession?.status);
    // Only navigate if we have all the data AND status is feedback
    if (gameSession?.status === 'feedback' && quiz && hasQuestions) {
      addLog(`[TEACHER QUIZ] Navigating to feedback page`);
      navigate(`/teacher-feedback/${gameSessionId}`);
    } else if (gameSession?.status === 'feedback') {
      addLog(`[TEACHER QUIZ] Status is feedback but waiting for quiz data`);
    }
  }, [gameSession, navigate, gameSessionId, quiz, hasQuestions, addLog]);

  const handleTimeUp = () => {
    addLog(`[TEACHER QUIZ] handleTimeUp called, timer=${JSON.stringify(gameSession?.timer)}`);
    console.log('handleTimeUp in TeacherQuizPage called');
    // Don't change status if timer is paused or doesn't exist
    if (!gameSession?.timer || gameSession.timer.isPaused) {
      addLog(`[TEACHER QUIZ] Timer paused or doesn't exist, not changing status`);
      return;
    }
    
    addLog(`[TEACHER QUIZ] Updating status to feedback`);
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    update(gameSessionRef, { status: 'feedback' });
  };

  const handleNextQuestion = () => {
    addLog(`[TEACHER QUIZ] handleNextQuestion called, currentIndex=${currentQuestionIndex}, isLastQuestion=${isLastQuestion}`);
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      addLog(`[TEACHER QUIZ] No quiz or questions available`);
      return;
    }
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);

    if (isLastQuestion) {
      addLog(`[TEACHER QUIZ] Last question reached, navigating to results`);
      update(gameSessionRef, {
        status: 'results'
      }).then(() => {
        navigate(`/teacher-results/${gameSessionId}`);
      });
      return;
    }

    // Find next non-hidden question
    let nextIndex = currentQuestionIndex + 1;
    while (nextIndex < quiz.questions.length && quiz.questions[nextIndex]?.hidden) {
      nextIndex++;
    }

    // If no more visible questions, go to results
    if (nextIndex >= quiz.questions.length) {
      update(gameSessionRef, {
        status: 'results'
      }).then(() => {
        navigate(`/teacher-results/${gameSessionId}`);
      });
      return;
    }

    const nextQuestion = quiz.questions[nextIndex];
    const timerState = createTimerState(nextQuestion.timer || 0);
    
    addLog(`[TEACHER QUIZ] Moving to next question: index=${nextIndex}, timer=${nextQuestion.timer}s`);
    update(gameSessionRef, {
      currentQuestionIndex: nextIndex,
      status: 'in-progress',
      timer: timerState
    });
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

  const handlePreviousQuestion = () => {
    if (gameSession && quiz && currentQuestionIndex > 0) {
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      const previousQuestionIndex = currentQuestionIndex - 1;
      const prevQuestion = quiz.questions[previousQuestionIndex];
      const timerState = createTimerState(prevQuestion.timer || 0);
      
      update(gameSessionRef, {
        currentQuestionIndex: previousQuestionIndex,
        status: 'in-progress',
        timer: timerState,
        lastUpdated: serverTimestamp()
      });
    }
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to end this quiz session? All students will be redirected to the waiting room.')) {
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      
      // Keep players but reset their scores and answers
      const resetPlayers = {};
      if (gameSession?.players) {
        Object.keys(gameSession.players).forEach(playerId => {
          resetPlayers[playerId] = {
            name: gameSession.players[playerId].name,
            ip: gameSession.players[playerId].ip,
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

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this session? This will return all players to the waiting room.')) {
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      
      // Keep players but reset their scores and answers
      const resetPlayers = {};
      if (gameSession?.players) {
        Object.keys(gameSession.players).forEach(playerId => {
          resetPlayers[playerId] = {
            name: gameSession.players[playerId].name,
            ip: gameSession.players[playerId].ip,
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
      // Don't allow jumping to hidden questions
      if (quiz.questions[index]?.hidden) {
        alert('Cannot jump to a hidden question.');
        return;
      }
      
      const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
      const jumpQuestion = quiz.questions[index];
      const timerState = createTimerState(jumpQuestion.timer || 0);
      
      update(gameSessionRef, {
        currentQuestionIndex: index,
        status: 'in-progress',
        timer: timerState
      });
    }
  };

  const isLoading = !gameSession || !quiz;

  const currentQuestion = hasQuestions ? quiz.questions[currentQuestionIndex] : null;
  
  // Check if this is the last visible (non-hidden) question
  const isLastQuestion = hasQuestions ? (() => {
    // Find if there are any more non-hidden questions after current
    for (let i = currentQuestionIndex + 1; i < quiz.questions.length; i++) {
      if (!quiz.questions[i]?.hidden) {
        return false; // Found a visible question after current
      }
    }
    return true; // No more visible questions
  })() : false;
  
  const isFirstQuestion = currentQuestionIndex === 0;
  const playerCount = gameSession?.players ? Object.keys(gameSession.players).length : 0;

  const questionForRenderer = currentQuestion ? (({ answer, ...rest }) => rest)(currentQuestion) : null;
  const effectivePassage = currentQuestion?.passage || quiz?.passage || null;

  const layoutStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    paddingBottom: '70px',
    paddingTop: '1rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    background: '#f8fafc',
    position: 'relative',
    overflow: 'hidden'
  }), []);

  const passagePanelStyle = useMemo(() => ({
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 28px 50px rgba(15, 23, 42, 0.15)'
  }), []);

  const questionWrapperStyle = useMemo(() => ({
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '0',
    height: '100%'
  }), []);

  const legacyQuestionShellStyle = {
    width: '100%',
    maxWidth: '1200px',
    padding: '20px',
    overflowY: 'auto',
    height: '100%',
    textAlign: 'center'
  };

  const renderQuestionBody = (isPassageOpen = false) => {
    if (isLoading) {
      return (
        <Center style={{ width: '100%', minHeight: 320 }}>
          <Loader color="violet" size="lg" />
        </Center>
      );
    }

    if (!currentQuestion || !questionForRenderer) {
      return (
        <Center style={{ width: '100%', minHeight: 320, flexDirection: 'column', gap: '0.5rem' }}>
          <Loader color="violet" size="lg" />
          <Text size="sm" c="dimmed">Preparing next question…</Text>
        </Center>
      );
    }

    return (
      <QuestionRenderer question={questionForRenderer} isPassageOpen={isPassageOpen} />
    );
  };

  const questionContent = (isPassageOpen) => (
    <Card 
      variant="mint" 
      style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        padding: '1.5rem', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}
    >
      <CardBody style={{ flex: 1, overflow: 'auto' }}>
        {renderQuestionBody(isPassageOpen)}
      </CardBody>
    </Card>
  );

  return (
    <div style={layoutStyle}>
      {/* Collapsible Passage Panel wraps the question area */}
      {/* When closed: shows hamburger button (if passage exists) + full-width question area */}
      {/* When open: shows resizable panels (passage left, question right) with draggable divider */}
      <CollapsiblePassagePanel
        passage={effectivePassage}
        title={quiz?.title ?? ''}
        style={passagePanelStyle}
      >
        {({ isPassageOpen }) => (
          <div style={questionWrapperStyle}>
            {questionContent(isPassageOpen)}
          </div>
        )}
      </CollapsiblePassagePanel>

      {/* Teacher Footer Bar - Fixed at bottom */}
      <TeacherFooterBar
        playerCount={playerCount}
        timerState={gameSession?.timer}
        canGoPrevious={!isFirstQuestion && hasQuestions}
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        nextDisabled={!hasQuestions || isLoading}
        onBackClick={handleBack}
        onPreviousClick={handlePreviousQuestion}
        onPauseResumeClick={handlePause}
        onNextClick={handleNextQuestion}
        onLogoutClick={handleLogout}
        questions={hasQuestions ? quiz.questions : []}
        onJumpToQuestion={handleJumpToQuestion}
        currentQuestionIndex={currentQuestionIndex}
        onTimeUp={handleTimeUp}
        players={gameSession?.players || {}}
        bannedPlayers={gameSession?.bannedPlayers || {}}
        onKickPlayer={handleKickPlayer}
        onUnbanPlayer={handleUnbanPlayer}
        onEndSessionClick={handleEndSession}
      />
    </div>
  );
};

export default TeacherQuizPage;