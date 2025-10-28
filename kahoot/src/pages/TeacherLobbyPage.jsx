import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, onValue, remove, push, update } from 'firebase/database';
import { AppShell } from '@mantine/core';
import UploadQuizModal from '../components/UploadQuizModal.jsx';
import QuizEditor from '../components/QuizEditor.jsx';
import { useThemeContext } from '../context/ThemeContext.jsx';
import { Card, CardBody, CardFooter } from '../components/modern';
import { Button } from '../components/modern';
import { Input } from '../components/modern';

const TeacherLobbyPage = () => {
  const navigate = useNavigate();
  const { template, darkMode } = useThemeContext();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  useEffect(() => {
    const quizzesRef = ref(database, 'quizzes');
    const unsubscribe = onValue(quizzesRef, (snapshot) => {
      const data = snapshot.val();
      const quizList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setQuizzes(quizList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const quizRef = ref(database, `quizzes/${id}`);
      remove(quizRef);
    }
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowEditModal(true);
  };


  const createMockQuiz = () => {
    const mockQuiz = {
      title: 'Mock Quiz for Testing',
      questions: [
        { 
          type: 'multiple-choice',
          question: 'What is 2 + 2?', 
          options: ['3', '4', '5', '6'], 
          answer: '4',
          timer: 10,
          points: 10
        },
        { 
          type: 'multiple-choice',
          question: 'What is the capital of France?', 
          options: ['London', 'Berlin', 'Paris', 'Madrid'], 
          answer: 'Paris',
          timer: 15,
          points: 10
        }
      ]
    };
    const quizzesRef = ref(database, 'quizzes');
    push(quizzesRef, mockQuiz);
  };

  const handleStartQuiz = (quizId) => {
    const gameSessionRef = ref(database, 'game_sessions/active_session');
    const sessionData = {
      quizId: quizId,
      status: 'waiting',
      currentQuestionIndex: 0,
      isPaused: false,
      bannedIps: {}
    };
    update(gameSessionRef, sessionData);
    navigate(`/teacher-wait/active_session`);
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderQuizCard = (quiz, index) => {
    const questionCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
    const variants = ['lavender', 'sky', 'mint', 'rose', 'peach'];
    const variant = variants[index % variants.length];

    return (
      <Card 
        key={quiz.id} 
        variant={variant}
        hover
        style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`
        }}
      >
        <CardBody style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700',
              marginBottom: '0.5rem',
              color: '#1e293b'
            }}>
              {quiz.title}
            </h3>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#64748b'
            }}>
              {questionCount} question{questionCount === 1 ? '' : 's'}
            </div>
          </div>
          
          <p style={{ fontSize: '0.875rem', color: '#64748b', flex: 1 }}>
            Edit questions, manage settings, and launch the quiz session.
          </p>
        </CardBody>

        <CardFooter style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button 
            variant="glass" 
            size="sm" 
            onClick={() => handleEditQuiz(quiz)} 
            style={{ flex: '1 1 auto' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(quiz.id)} 
            style={{ flex: '1 1 auto' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.25rem' }}>
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Delete
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleStartQuiz(quiz.id)} 
            style={{ flex: '1 1 100%' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.25rem' }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #faf5ff 0%, #f0f9ff 25%, #f0fdfa 50%, #fff7ed 75%, #faf5ff 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <AppShell header={{ height: 70 }} padding="md">
        <AppShell.Header style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(203, 213, 225, 0.3)'
        }}>
          <div style={{ 
            height: '100%', 
            padding: '0 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Teacher Lobby
            </h2>
            <Button variant="glass" onClick={handleLogout}>Logout</Button>
          </div>
        </AppShell.Header>
        
        <AppShell.Main>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '2.5rem', animation: 'slideDown 0.5s ease-out' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800',
                marginBottom: '0.5rem',
                color: '#1e293b'
              }}>
                Quiz Dashboard
              </h1>
              <p style={{ fontSize: '1rem', color: '#64748b' }}>
                Manage your quizzes and start new game sessions
              </p>
            </div>

            {/* Search and Actions Bar */}
            <Card 
              variant="glass" 
              style={{ 
                marginBottom: '2rem',
                animation: 'slideUp 0.5s ease-out 0.1s backwards'
              }}
            >
              <CardBody>
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  alignItems: 'flex-end',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <Input
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      variant="default"
                      size="md"
                    />
                  </div>
                  
                  <Button 
                    variant="primary" 
                    onClick={() => setShowUploadModal(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '0.5rem' }}>
                      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                    Upload Quiz
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Quiz Grid */}
            {filteredQuizzes.length === 0 ? (
              <Card 
                variant="default" 
                style={{ 
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  animation: 'scaleIn 0.5s ease-out 0.2s backwards'
                }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ margin: '0 auto 1.5rem' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <h2 style={{ 
                  fontSize: '1.75rem', 
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#1e293b'
                }}>
                  No quizzes found
                </h2>
                <p style={{ fontSize: '1rem', color: '#64748b' }}>
                  Upload or create a quiz to get started
                </p>
              </Card>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {filteredQuizzes.map((quiz, index) => renderQuizCard(quiz, index))}
              </div>
            )}
          </div>
        </AppShell.Main>

        {/* Modals */}
        <UploadQuizModal show={showUploadModal} handleClose={() => setShowUploadModal(false)} />
        {selectedQuiz && (
          <QuizEditor 
            show={showEditModal} 
            handleClose={() => setShowEditModal(false)} 
            quiz={selectedQuiz} 
          />
        )}
      </AppShell>
    </div>
  );
};

export default TeacherLobbyPage;
