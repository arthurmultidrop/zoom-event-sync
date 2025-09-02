import { useState, useEffect, useCallback } from 'react';
import { ZoomIntegrationResponse, CreateMeetingRequest, CreateMeetingResponse } from '@/types/zoom';

const API_BASE = 'http://localhost:8080/integrations/zoom';

export const useZoom = () => {
  const [zoomStatus, setZoomStatus] = useState<ZoomIntegrationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkZoomStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For this POC, we'll simulate a JWT token
      const mockToken = 'your-jwt-token-here';
      
      const response = await fetch(`${API_BASE}/status`, {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setZoomStatus(data);
      } else {
        setZoomStatus(null);
      }
    } catch (err) {
      console.error('Error checking Zoom status:', err);
      setError('Failed to check Zoom connection status');
      setZoomStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectToZoom = useCallback(async (userId: string = 'demo-user') => {
    try {
      const redirectUri = encodeURIComponent(window.location.origin);
      const connectUrl = `${API_BASE}/connect?userId=${userId}&redirectUri=${redirectUri}`;
      
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
      
      // For this POC, we'll simulate a JWT token
      const mockToken = 'your-jwt-token-here';
      
      const response = await fetch(`${API_BASE}/meeting`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to create meeting');
      }
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to create meeting');
      return null;
    }
  }, []);

  useEffect(() => {
    checkZoomStatus();
  }, [checkZoomStatus]);

  return {
    zoomStatus,
    isLoading,
    error,
    connectToZoom,
    createMeeting,
    checkZoomStatus,
  };
};