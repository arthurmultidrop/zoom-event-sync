import { useState, useEffect, useCallback } from 'react';
import { ZoomIntegrationResponse, CreateMeetingRequest, CreateMeetingResponse } from '@/types/zoom';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = 'https://multidrop-dev.ew.r.appspot.com/integrations/zoom';

export const useZoom = () => {
  const [zoomStatus, setZoomStatus] = useState<ZoomIntegrationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkZoomStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user?.accessToken) {
        setError('Usuário não autenticado');
        setZoomStatus(null);
        return;
      }
      
      const response = await fetch(`${API_BASE}/status`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.data) {
        // User is connected to Zoom
        setZoomStatus({
          isConnected: true,
          userId: data.data.userId || '',
          accountId: data.data.accountId || '',
          accountType: data.data.accountType || '',
          userEmail: data.data.zoomEmail,
          userName: data.data.zoomFirstName ? `${data.data.zoomFirstName} ${data.data.zoomLastName}` : undefined,
        });
      } else {
        // User is not connected
        setZoomStatus(null);
      }
    } catch (err) {
      console.error('Error checking Zoom status:', err);
      setError('Failed to check Zoom connection status');
      setZoomStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.accessToken]);

  const connectToZoom = useCallback(async (userId: string = '1') => {
    try {
      const connectUrl = `${API_BASE}/connect?userId=${userId}`;
      
      // Redirect to Zoom authorization
      window.location.href = connectUrl;
    } catch (err) {
      console.error('Error connecting to Zoom:', err);
      setError('Failed to connect to Zoom');
    }
  }, []);

  const createMeeting = useCallback(async (request: CreateMeetingRequest): Promise<CreateMeetingResponse | null> => {
    try {
      setError(null);
      
      if (!user?.accessToken) {
        setError('Usuário não autenticado');
        return null;
      }
      
      const response = await fetch(`${API_BASE}/meeting`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          topic: request.topic,
          startTime: request.startTime,
          duration: request.duration.toString()
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Extract meeting ID from the response message
        const meetingId = data.data?.split('ID: ')[1] || `meeting-${Date.now()}`;
        
        return {
          meetingId: meetingId,
          joinUrl: `https://zoom.us/j/${meetingId}`,
          startUrl: `https://zoom.us/s/${meetingId}`
        };
      } else {
        const errorMessage = data.erros?.[0] || 'Failed to create meeting';
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to create meeting');
      return null;
    }
  }, [user?.accessToken]);

  useEffect(() => {
    if (user?.accessToken) {
      checkZoomStatus();
    } else {
      setIsLoading(false);
    }
  }, [checkZoomStatus, user?.accessToken]);

  return {
    zoomStatus,
    isLoading,
    error,
    connectToZoom,
    createMeeting,
    checkZoomStatus,
  };
};