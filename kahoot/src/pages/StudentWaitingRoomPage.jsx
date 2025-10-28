import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, get, onDisconnect } from 'firebase/database';
import { database } from '../services/firebase';
import CustomAvatar from '../components/CustomAvatar.jsx';
import { AppShell, Title, Text, Paper, SimpleGrid, Center, Loader, Group, Divider } from '@mantine/core';

const StudentWaitingRoomPage = () => {
  const [gameSession, setGameSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const { gameSessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const gameSessionRef = ref(database, `game_sessions/${gameSessionId}`);
    const unsubscribe = onValue(gameSessionRef, (snapshot) => {
      const sessionData = snapshot.val();
      setGameSession(sessionData);

      if (!sessionData) {
        navigate('/');
        return;
      }

      if (sessionData?.status === 'in-progress') {
        navigate(`/student-quiz/${gameSessionId}`);
      }
    });

    // Set up presence detection for current player
    const playerId = sessionStorage.getItem('playerId');
    if (playerId) {
      const playerRef = ref(database, `game_sessions/${gameSessionId}/players/${playerId}`);
      onDisconnect(playerRef).remove();
    }

    return () => unsubscribe();
  }, [gameSessionId, navigate]);

  useEffect(() => {
    if (gameSession) {
      if (gameSession.quizId && !quiz) {
        const quizRef = ref(database, `quizzes/${gameSession.quizId}`);
        get(quizRef).then((quizSnapshot) => {
          if (quizSnapshot.exists()) {
            setQuiz({ id: quizSnapshot.key, ...quizSnapshot.val() });
          }
        });
      }

      if (gameSession.players) {
        const playerList = Object.keys(gameSession.players).map(key => ({ id: key, ...gameSession.players[key] }));
        setPlayers(playerList);
      } else {
        setPlayers([]);
      }
    }
  }, [gameSession, quiz]);

  if (!gameSession?.quizId) {
    return (
      <Center style={{ height: '100vh', flexDirection: 'column', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Loader size="xl" color="white" />
        <Text mt="md" c="white" fw={600} size="lg">Waiting for teacher to select a quiz...</Text>
      </Center>
    );
  }

  if (!quiz) {
    return (
      <Center style={{ height: '100vh', flexDirection: 'column', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Loader size="xl" color="white" />
        <Text mt="md" c="white" fw={600} size="lg">Loading quiz...</Text>
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      style={{
        background: 'linear-gradient(135deg, #fafbfc 0%, #f0f4f8 50%, #fafbfc 100%)',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <AppShell.Header style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(203, 213, 225, 0.3)',
        color: '#1e293b'
      }}>
        <Group h="100%" px="md">
          <Title order={3}>Waiting Room</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Paper 
          withBorder 
          shadow="md" 
          p={30} 
          mt={30} 
          radius="xl"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          }}
        >
            <Title order={2} ta="center" style={{ color: '#1e293b', fontWeight: 700 }}>{quiz.title}</Title>
            <Text ta="center" mt="sm" style={{ color: '#475569', fontWeight: 600, fontSize: '1.1rem' }}>Waiting for the teacher to start the quiz...</Text>
            
            <Divider my="xl" label={`Players Joined (${players.length})`} labelPosition="center" />

            <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="lg">
                {players.map((player) => (
                    <Paper 
                      key={player.id} 
                      withBorder 
                      p="xs" 
                      radius="lg" 
                      style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                        <CustomAvatar name={player.name} />
                        <Text mt="sm" size="sm" ta="center" style={{ color: '#1e293b', fontWeight: 600 }}>{player.name}</Text>
                    </Paper>
                ))}
            </SimpleGrid>
        </Paper>
      </AppShell.Main>
    </AppShell>
  );
};

export default StudentWaitingRoomPage;