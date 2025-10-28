import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, get, onDisconnect } from 'firebase/database';
import { database } from '../services/firebase';
import { useForm } from '@mantine/form';
import { Card, CardBody, CardFooter } from '../components/modern';
import { Button } from '../components/modern';
import { Input } from '../components/modern';

const LoginPage = ({ setShowAdminLogin }) => {
  const navigate = useNavigate();
  const [duplicateNameError, setDuplicateNameError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
      navigate('/lobby');
    } else {
      const playerId = sessionStorage.getItem('playerId');
      const playerName = sessionStorage.getItem('playerName');
      if (playerId && playerName) {
        rejoinStudent(playerId, playerName);
      }
    }
  }, [navigate]);

  const rejoinStudent = async (playerId, playerName) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
      
      // Get IP address
      let ip = 'unknown';
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ip = data.ip;
      } catch (error) {
        console.error('Error getting IP address, proceeding with "unknown":', error);
      }
      
      // Check if player is banned before rejoining
      const bannedPlayersRef = ref(database, 'game_sessions/active_session/bannedPlayers');
      const snapshot = await get(bannedPlayersRef);
      if (snapshot.exists()) {
        const bannedPlayers = snapshot.val();
        
        // Check if banned by IP (if IP is known) or by player ID
        const isBannedByIp = ip !== 'unknown' && Object.values(bannedPlayers).some(player => player.ip === ip && player.ip !== 'unknown');
        const isBannedById = bannedPlayers[playerId];
        
        if (isBannedByIp || isBannedById) {
          alert('You have been banned from this game session.');
          sessionStorage.removeItem('playerId');
          sessionStorage.removeItem('playerName');
          navigate('/');
          return;
        }
      }
      
      const playerRef = ref(database, `game_sessions/active_session/players/${playerId}`);
      const playerData = { name: playerName, score: 0, ip: ip }; // Reset score and IP
      await set(playerRef, playerData);
      
      // Set up automatic removal when player disconnects
      onDisconnect(playerRef).remove();
      
      navigate('/student-wait/active_session');
    } catch (error) {
      console.error('Error rejoining game:', error);
    }
  };

  const form = useForm({
    initialValues: {
      name: '',
    },

    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
    },
  });

  const handleStudentJoin = async (values) => {
    // Clear any previous error
    setDuplicateNameError(false);

    // Normalize the entered name for comparison (lowercase and trim)
    const normalizedName = values.name.trim().toLowerCase();

    // Check for duplicate names
    const playersRef = ref(database, 'game_sessions/active_session/players');
    const playersSnapshot = await get(playersRef);
    let isDuplicate = false;
    if (playersSnapshot.exists()) {
      const players = playersSnapshot.val();
      if (players && typeof players === 'object') {
        const existingNames = Object.values(players).map(player =>
          (player && player.name) ? player.name.trim().toLowerCase() : ''
        );
        if (existingNames.includes(normalizedName)) {
          isDuplicate = true;
        }
      }
    }

    if (isDuplicate) {
      setDuplicateNameError(true);
    } else {
      try {
        let ip = 'unknown';
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          ip = data.ip;
        } catch (error) {
          console.error('Error getting IP address, proceeding with "unknown":', error);
        }

        // Check if player is banned by IP or player ID
        const bannedPlayersRef = ref(database, 'game_sessions/active_session/bannedPlayers');
        const snapshot = await get(bannedPlayersRef);
        if (snapshot.exists()) {
          const bannedPlayers = snapshot.val();
          const existingPlayerId = sessionStorage.getItem('playerId');
          
          // Check if banned by IP (if IP is known) or by player ID
          const isBannedByIp = ip !== 'unknown' && Object.values(bannedPlayers).some(player => player.ip === ip && player.ip !== 'unknown');
          const isBannedById = existingPlayerId && bannedPlayers[existingPlayerId];
          
          if (isBannedByIp || isBannedById) {
            alert('You have been banned from this game session.');
            return;
          }
        }

        const existingPlayerId = sessionStorage.getItem('playerId');
        const uniqueId = existingPlayerId || Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        const playerRef = ref(database, `game_sessions/active_session/players/${uniqueId}`);

        const playerData = { name: values.name.trim(), score: 0, ip: ip };
        await set(playerRef, playerData);

        // Set up automatic removal when player disconnects
        onDisconnect(playerRef).remove();

        sessionStorage.setItem('playerId', uniqueId);
        sessionStorage.setItem('playerName', values.name.trim());
        navigate('/student-wait/active_session');
      } catch (error) {
        console.error('Error joining game:', error);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(251, 113, 133, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 10s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '20%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'float 12s ease-in-out infinite'
      }} />

      <Card 
        variant="lavender" 
        style={{ 
          maxWidth: '420px', 
          width: '100%',
          position: 'relative',
          zIndex: 1,
          animation: 'slideUp 0.5s ease-out'
        }}
      >
        <CardBody>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 50%, #fb7185 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.5rem'
            }}>
              Join Game
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
              Enter your name to start playing
            </p>
          </div>

          {duplicateNameError && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              background: 'rgba(254, 242, 242, 0.5)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              animation: 'scaleIn 0.3s ease-out'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444" style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="white" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="white" strokeWidth="2"/>
              </svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#dc2626', marginBottom: '0.25rem' }}>
                  Name Already Taken
                </div>
                <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                  This name is already taken. Please choose another.
                </div>
              </div>
              <button
                onClick={() => setDuplicateNameError(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={form.onSubmit(handleStudentJoin)}>
            <Input
              label="Your Name"
              placeholder="Enter your name"
              variant="lavender"
              size="lg"
              fullWidth
              required
              error={form.errors.name}
              {...form.getInputProps('name')}
            />
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              type="submit"
              style={{ marginTop: '1.5rem' }}
            >
              Join Game
            </Button>
          </form>
        </CardBody>
        
        <CardFooter style={{ justifyContent: 'center', borderTop: 'none', paddingTop: '0' }}>
          <Button 
            variant="glass" 
            size="md"
            onClick={() => { 
              console.log('Admin Login button clicked'); 
              setShowAdminLogin(true); 
            }}
          >
            Admin Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;