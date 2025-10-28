import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, onValue, update, get } from 'firebase/database';
import { calculateScore } from '../utils/scoring';
// import { useLog } from '../context/LogContext'; // DISABLED FOR TESTING
import SemicircleTimer from '../components/SemicircleTimer';
import StudentAnswerInput from '../components/StudentAnswerInput';

/**
 * StudentQuizPageNew - Enhanced with adaptive layout and all question types
 * Uses StudentAnswerInput component with useAdaptiveLayout hook
 * Supports: multiple-choice, multiple-select, matching, completion, diagram-labeling
 */

const StudentQuizPageNew = () => {
  const { gameSessionId } = useParams();
  const navigate = useNavigate();
  // const { addLog } = useLog(); // DISABLED FOR TESTING
  const addLog = () => {}; // No-op function
  const [gameSession, setGameSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const selectedAnswerRef = useRef(''); // Store answer synchronously
  const hasSubmittedRef = useRef(false);
  const currentQuestionIndexRef = useRef(null);

  // Listen to game session
  useEffect(() => {
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    const unsubscribe = onValue(gameSessionRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        navigate('/');
        return;
      }
      setGameSession(data);
    });
    return () => unsubscribe();
  }, [gameSessionId, navigate]);

  // Handle navigation based on status
  useEffect(() => {
    if (!gameSession) return;
    
    if (gameSession.status === 'waiting') {
      navigate(`/student-wait/${gameSessionId}`);
    } else if (gameSession.status === 'feedback') {
      navigate(`/student-feedback/${gameSessionId}`);
    } else if (gameSession.status === 'results') {
      navigate(`/student-results/${gameSessionId}`);
    }
  }, [gameSession, navigate, gameSessionId]);

  // Load quiz
  useEffect(() => {
    if (gameSession?.quizId && !quiz) {
      const quizRef = ref(database, `quizzes/${gameSession.quizId}`);
      get(quizRef).then((snapshot) => {
        if (snapshot.exists()) {
          const quizData = snapshot.val();
          const questionsArray = Array.isArray(quizData.questions)
            ? quizData.questions
            : Object.keys(quizData.questions || {})
                .sort((a, b) => Number(a) - Number(b))
                .map(key => quizData.questions[key]);
          
          addLog('Quiz loaded');
          setQuiz(quizData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSession, quiz]);

  // Reset when question changes
  useEffect(() => {
    if (gameSession) {
      const newIndex = gameSession.currentQuestionIndex || 0;
      if (currentQuestionIndexRef.current !== newIndex) {
        addLog(`Question changed from ${currentQuestionIndexRef.current} to ${newIndex}`);
        addLog(`Previous answer: ${selectedAnswerRef.current}`);
        setSelectedAnswer('');
        selectedAnswerRef.current = ''; // Reset ref too
        hasSubmittedRef.current = false;
        addLog(`hasSubmittedRef reset: ${hasSubmittedRef.current}`);
        currentQuestionIndexRef.current = newIndex;
      }
    }
  }, [gameSession, addLog]);

  // Handle timer end - submit current answer
  const handleTimeUp = () => {
    addLog('handleTimeUp called');
    if (hasSubmittedRef.current) {
      addLog('handleTimeUp returned early because hasSubmittedRef.current is true');
      return;
    }
    
    const playerId = sessionStorage.getItem('playerId');
    if (!playerId) {
      addLog('handleTimeUp - ERROR: No playerId in sessionStorage');
      return;
    }
    if (!gameSession) {
      addLog('handleTimeUp - ERROR: No gameSession');
      return;
    }
    if (!gameSession.players) {
      addLog('handleTimeUp - ERROR: gameSession.players is null/undefined');
      return;
    }
    if (!gameSession.players[playerId]) {
      addLog(`handleTimeUp - ERROR: Player ${playerId} not found in gameSession.players`);
      addLog(`Available players: ${Object.keys(gameSession.players).join(', ')}`);
      return;
    }
    if (!quiz) {
      addLog('handleTimeUp - ERROR: No quiz data');
      return;
    }

    const questionIndex = gameSession.currentQuestionIndex || 0;
    
    // Handle both array and object format for questions
    const questions = Array.isArray(quiz.questions) 
      ? quiz.questions 
      : Object.keys(quiz.questions || {})
          .sort((a, b) => Number(a) - Number(b))
          .map(key => quiz.questions[key]);
    const question = questions[questionIndex];
    
    // Use ref value instead of state (eliminates timing issues)
    const answerToSubmit = selectedAnswerRef.current;
    
    const submitDisplay = typeof answerToSubmit === 'object' ? JSON.stringify(answerToSubmit) : answerToSubmit;
    addLog(`handleTimeUp - Submitting answer: ${submitDisplay}`);
    
    const currentPlayer = gameSession.players[playerId];
    
    // Calculate score (will be 0 if no answer selected)
    const score = answerToSubmit ? calculateScore(question, answerToSubmit) : 0;
    const isCorrect = score === 10; // Only mark as correct if full points earned
    
    addLog(`handleTimeUp - Score: ${score}, Correct: ${isCorrect}`);

    // Update Firebase
    const playerRef = ref(database, `game_sessions/${gameSessionId}/players/${playerId}`);
    update(playerRef, {
      score: (currentPlayer?.score || 0) + score,
      answers: {
        ...(currentPlayer?.answers || {}),
        [questionIndex]: {
          answer: answerToSubmit || null,
          isCorrect,
          score,
          timeSpent: 0
        }
      }
    });

    hasSubmittedRef.current = true;
    addLog('handleTimeUp - Answer submitted');
  };

  // Handle answer selection - now using direct click instead of radio onChange
  const handleAnswerSelect = (answer) => {
    // Prevent answer changes after submission
    if (hasSubmittedRef.current) {
      addLog('handleAnswerSelect blocked - answer already submitted');
      return;
    }
    
    const questionIndex = gameSession?.currentQuestionIndex || 0;
    const answerDisplay = typeof answer === 'object' ? JSON.stringify(answer) : answer;
    addLog(`handleAnswerSelect called with answer: ${answerDisplay}`);
    
    // Store in ref immediately (synchronous, no timing issues)
    selectedAnswerRef.current = answer;
    
    // Also update state for UI
    setSelectedAnswer(answer);
    
    const storedDisplay = typeof selectedAnswerRef.current === 'object' ? JSON.stringify(selectedAnswerRef.current) : selectedAnswerRef.current;
    addLog(`Answer stored in ref: ${storedDisplay}`);
  };

  if (!gameSession || !quiz) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '2rem'
      }}>
        Loading...
      </div>
    );
  }

  // Handle both array and object format for questions
  const questions = Array.isArray(quiz.questions) 
    ? quiz.questions 
    : Object.keys(quiz.questions || {})
        .sort((a, b) => Number(a) - Number(b))
        .map(key => quiz.questions[key]);
  const currentQuestion = questions[gameSession.currentQuestionIndex || 0];

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'hidden'
    }}>
      {/* Timer */}
      {currentQuestion?.timer && gameSession.timer && (
        <SemicircleTimer
          key={gameSession.currentQuestionIndex}
          timerState={gameSession.timer}
          onTimeUp={handleTimeUp}
        />
      )}

      {/* Answer Input Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        paddingTop: currentQuestion?.timer ? '8rem' : '2rem',
        overflow: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          height: '100%',
          maxHeight: '800px'
        }}>
          <StudentAnswerInput
            question={currentQuestion}
            onAnswerSubmit={handleAnswerSelect}
            currentAnswer={selectedAnswer}
            disabled={hasSubmittedRef.current}
          />
        </div>
      </div>

      {/* Status Indicator */}
      {hasSubmittedRef.current && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(39, 174, 96, 0.95)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '2rem',
          fontSize: '1.2rem',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 20
        }}>
          ✓ Answer Submitted
        </div>
      )}
    </div>
  );
};

export default StudentQuizPageNew;