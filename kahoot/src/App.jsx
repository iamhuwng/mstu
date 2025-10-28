import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { Center, Loader } from '@mantine/core';

// Lazy load all page components for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const TeacherLobbyPage = lazy(() => import('./pages/TeacherLobbyPage.jsx'));
const StudentWaitingRoomPage = lazy(() => import('./pages/StudentWaitingRoomPage.jsx'));
const TeacherWaitingRoomPage = lazy(() => import('./pages/TeacherWaitingRoomPage.jsx'));
const TeacherQuizPage = lazy(() => import('./pages/TeacherQuizPage.jsx'));
const StudentQuizPage = lazy(() => import('./pages/StudentQuizPageNew.jsx'));
const TeacherResultsPage = lazy(() => import('./pages/TeacherResultsPage.jsx'));
const StudentResultsPage = lazy(() => import('./pages/StudentResultsPage.jsx'));
const StudentFeedbackPage = lazy(() => import('./pages/StudentFeedbackPage.jsx'));
const TeacherFeedbackPage = lazy(() => import('./pages/TeacherFeedbackPage.jsx'));
import PrivateRoute from './components/PrivateRoute.jsx';
// import { LogProvider } from './context/LogContext.jsx'; // DISABLED FOR TESTING
import AdminLoginModal from './components/AdminLoginModal.jsx';

// Loading fallback component
const LoadingFallback = () => (
  <Center style={{ height: '100vh' }}>
    <Loader size="xl" />
  </Center>
);

// Placeholder components for routing
const Placeholder = ({ name }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{name} Page</h1>
    <nav>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/">Login</Link></li>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/lobby">Lobby</Link></li>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/student-wait/test">Student Waiting Room</Link></li>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/teacher-wait/test">Teacher Waiting Room</Link></li>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/student-quiz/test">Student Quiz</Link></li>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/teacher-quiz/test">Teacher Quiz</Link></li>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/student-results/test">Student Results</Link></li>
        <li style={{ display: 'inline', margin: '0 1rem' }}><Link to="/teacher-results/test">Teacher Results</Link></li>
      </ul>
    </nav>
    <p>This is a placeholder for the {name} page.</p>
  </div>
);



function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LoginPage setShowAdminLogin={setShowAdminLogin} />} />
          <Route path="/lobby" element={<PrivateRoute><TeacherLobbyPage /></PrivateRoute>} />
          <Route path="/teacher-wait/:gameSessionId" element={<PrivateRoute><TeacherWaitingRoomPage /></PrivateRoute>} />
          <Route path="/teacher-quiz/:gameSessionId" element={<PrivateRoute><TeacherQuizPage /></PrivateRoute>} />
          <Route path="/teacher-feedback/:gameSessionId" element={<PrivateRoute><TeacherFeedbackPage /></PrivateRoute>} />
          <Route path="/teacher-results/:gameSessionId" element={<PrivateRoute><TeacherResultsPage /></PrivateRoute>} />

          {/* Student Routes */}
          <Route path="/student-wait/:gameSessionId" element={<StudentWaitingRoomPage />} />
          <Route path="/student-quiz/:gameSessionId" element={<StudentQuizPage />} />
          <Route path="/student-feedback/:gameSessionId" element={<StudentFeedbackPage />} />
          <Route path="/student-results/:gameSessionId" element={<StudentResultsPage />} />
        </Routes>
        <AdminLoginModal show={showAdminLogin} handleClose={() => setShowAdminLogin(false)} />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
