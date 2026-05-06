'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, Chip, CircularProgress, Alert, Button } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';

interface Notification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event';
  Message: string;
  Timestamp: string;
}

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('All');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Placement': return <WorkIcon fontSize="small" sx={{ color: 'var(--type-placement)' }} />;
      case 'Result': return <SchoolIcon fontSize="small" sx={{ color: 'var(--type-result)' }} />;
      case 'Event': return <EventIcon fontSize="small" sx={{ color: 'var(--type-event)' }} />;
      default: return null;
    }
  };

  const filteredNotifications = filter === 'All' 
    ? notifications 
    : notifications.filter(n => n.Type === filter);

  return (
    <Container maxWidth="md" sx={{ py: 6, minHeight: '100vh' }}>
      <Box className="glass-panel" sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 3, 
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#6366f1',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
          }}>
            <NotificationsActiveIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#f8fafc', letterSpacing: '-0.5px' }}>
              Priority Inbox
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
              Top 10 Most Important Unread Notifications
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
          {['All', 'Placement', 'Result', 'Event'].map((type) => (
            <Chip 
              key={type}
              label={type}
              onClick={() => setFilter(type)}
              sx={{ 
                fontWeight: 600,
                background: filter === type ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.05)',
                color: filter === type ? '#fff' : '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': { background: filter === type ? 'rgba(99, 102, 241, 0.9)' : 'rgba(255, 255, 255, 0.1)', transform: 'translateY(-1px)' }
              }}
            />
          ))}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress sx={{ color: '#6366f1' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredNotifications.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 3, border: '1px dashed rgba(255,255,255,0.1)' }}>
                <Typography sx={{ color: '#94a3b8', fontSize: '1.1rem' }}>
                  No notifications match your filter.
                </Typography>
              </Box>
            ) : (
              filteredNotifications.map((notif, index) => (
                <Box 
                  key={notif.ID} 
                  className="animate-fade-in"
                  sx={{ 
                    p: 3, 
                    borderRadius: 3, 
                    background: readIds.has(notif.ID) ? 'rgba(30, 41, 59, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'flex-start' },
                    gap: 2.5,
                    animationDelay: `${index * 0.05}s`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: notif.Type === 'Placement' ? 'var(--type-placement)' : notif.Type === 'Result' ? 'var(--type-result)' : 'var(--type-event)',
                      opacity: 0.5,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': {
                      background: 'rgba(30, 41, 59, 0.8)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.5)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      '&::before': { opacity: 1 }
                    }
                  }}
                >
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: '50%', 
                    background: 'rgba(15, 23, 42, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {getIcon(notif.Type)}
                  </Box>
                  
                  <Box sx={{ flex: 1, pt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                      <span className={`type-badge type-${notif.Type.toLowerCase()}`}> {notif.Type} </span>
                      <Typography variant="caption" sx={{ color: '#64748b', ml: 'auto', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b', display: 'inline-block' }} />
                        {formatDistanceToNow(new Date(notif.Timestamp), { addSuffix: true })}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#f1f5f9', fontWeight: 400, fontSize: '1.05rem', lineHeight: 1.5 }}>
                      {notif.Message}
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ mt: 1, borderColor: readIds.has(notif.ID) ? 'rgba(255,255,255,0.3)' : 'rgba(99,102,241,0.6)', color: readIds.has(notif.ID) ? '#aaa' : '#6366f1' }}
                      onClick={() => {
                        const newSet = new Set(readIds);
                        if (newSet.has(notif.ID)) {
                          newSet.delete(notif.ID);
                        } else {
                          newSet.add(notif.ID);
                        }
                        setReadIds(newSet);
                      }}
                    >
                      {readIds.has(notif.ID) ? 'Mark Unread' : 'Mark As Read'}
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}
