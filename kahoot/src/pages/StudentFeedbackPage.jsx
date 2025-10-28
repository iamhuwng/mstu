import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, onValue, get } from 'firebase/database';
import SoundService from '../services/SoundService';
import { Progress, Text } from '@mantine/core';
import { useThemeContext } from '../context/ThemeContext.jsx';

const StudentFeedbackPage = () => {
  const { gameSessionId } = useParams();
  const navigate = useNavigate();
  const { colorScheme } = useThemeContext();
  const playerId = sessionStorage.getItem('playerId');
  const [gameSession, setGameSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef(null);

  useEffect(() => {
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    const unsubscribe = onValue(gameSessionRef, (snapshot) => {
      const session = snapshot.val();
      if (!session) {
        navigate('/');
        return;
      }
      setGameSession(session);

      if (session.status === 'in-progress') {
        navigate(`/student-quiz/${gameSessionId}`);
      } else if (session.status === 'waiting') {
        navigate(`/student-wait/${gameSessionId}`);
      }
    });

    return () => unsubscribe();
  }, [gameSessionId, navigate]);

  useEffect(() => {
    if (gameSession && gameSession.quizId && !quiz) {
      const quizRef = ref(database, `quizzes/${gameSession.quizId}`);
      get(quizRef).then((quizSnapshot) => {
        if (quizSnapshot.exists()) {
          setQuiz(quizSnapshot.val());
        }
      });
    }
  }, [gameSession, quiz]);

  useEffect(() => {
    if (gameSession && quiz) {
      const player = gameSession.players[playerId];
      if (!player) return;

      const questionIndex = gameSession.currentQuestionIndex || 0;
      const lastAnswer = player.answers && player.answers[questionIndex] ? player.answers[questionIndex] : null;

      const question = quiz.questions[questionIndex];
      let newFeedback;

      if (lastAnswer) {
        newFeedback = {
          isCorrect: lastAnswer.isCorrect,
          correctAnswer: question.answer,
          newScore: player.score,
          score: lastAnswer.score || 0,
        };
      } else {
        // Handle case where student did not answer
        newFeedback = {
          isCorrect: false,
          correctAnswer: question.answer,
          newScore: player.score,
          score: 0,
        };
      }
      setFeedback(newFeedback);
    }
  }, [gameSession, quiz, playerId]);

  useEffect(() => {
    if (feedback) {
      setCountdown(5);
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [feedback]);

  if (!feedback) {
    return <div>Loading...</div>;
  }

  const currentQuestionIndex = gameSession.currentQuestionIndex || 0;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div style={{
      minHeight: '100vh',
      background: colorScheme === 'dark'
        ? 'linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #0a0f1e 100%)'
        : 'linear-gradient(135deg, #fafbfc 0%, #f0f4f8 50%, #fafbfc 100%)',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '700px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Result Header Card */}
        <div style={{
          background: feedback.isCorrect 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(248, 113, 113, 0.15) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: feedback.isCorrect 
            ? '2px solid rgba(16, 185, 129, 0.3)'
            : '2px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
          animation: 'scaleIn 0.5s ease-out'
        }}>
          <h1 style={{ 
            color: feedback.isCorrect ? '#059669' : '#dc2626', 
            fontSize: '3.5rem', 
            marginBottom: '1rem',
            fontWeight: '700',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </h1>
          <p style={{ 
            fontSize: '1.75rem', 
            marginBottom: '0',
            fontWeight: '600'
          }}>
            Points earned: <span style={{
              color: feedback.isCorrect ? '#059669' : '#dc2626',
              fontSize: '2rem'
            }}>+{feedback.score}</span>
          </p>
        </div>

        {/* Correct Answer Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}>💡</div>
            <p style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              margin: 0
            }}>
              Correct Answer
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#4f46e5'
          }}>
            {Array.isArray(feedback.correctAnswer)
              ? feedback.correctAnswer.join(', ')
              : feedback.correctAnswer}
          </div>
        </div>

        {/* Score Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '0.5rem',
            opacity: 0.8
          }}>
            Your Total Score
          </p>
          <p style={{ 
            fontSize: '3rem', 
            fontWeight: '700',
            margin: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {feedback.newScore}
          </p>
        </div>

        {/* Countdown Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          padding: '1.5rem',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
        }}>
          <Text size="md" style={{ marginBottom: '0.75rem', textAlign: 'center', opacity: 0.9 }}>
            {isLastQuestion ? 'Moving to final results...' : `Next question in ${countdown} second${countdown !== 1 ? 's' : ''}...`}
          </Text>
          <Progress
            value={(countdown / 5) * 100}
            size="lg"
            color={countdown <= 2 ? 'red' : countdown <= 3 ? 'yellow' : 'blue'}
            animated
            striped
            style={{ borderRadius: '12px' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentFeedbackPage;