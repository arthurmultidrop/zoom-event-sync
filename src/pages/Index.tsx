import { useState, useCallback } from 'react';
import { ZoomConnectionStatus } from '@/components/ZoomConnectionStatus';
import { EventForm } from '@/components/EventForm';
import { EventList } from '@/components/EventList';
import { useZoom } from '@/hooks/useZoom';
import { EventForm as EventFormData, ZoomEvent } from '@/types/zoom';
import { Video } from 'lucide-react';

const Index = () => {
  const { zoomStatus, isLoading, error, connectToZoom, createMeeting } = useZoom();
  const [events, setEvents] = useState<ZoomEvent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectZoom = useCallback(() => {
    connectToZoom('demo-user');
  }, [connectToZoom]);

  const handleCreateEvent = useCallback(async (eventData: EventFormData) => {
    if (!zoomStatus?.isConnected) {
      throw new Error('Zoom not connected');
    }

    setIsSubmitting(true);
    
    try {
      // Convert form data to ISO format for API
      const startDateTime = new Date(`${eventData.startDate}T${eventData.startTime}`);
      const isoDateTime = startDateTime.toISOString();

      const meetingResult = await createMeeting({
        topic: eventData.title,
        startTime: isoDateTime,
        duration: eventData.duration,
      });

      // Create the event record
      const newEvent: ZoomEvent = {
        id: `event-${Date.now()}`,
        title: eventData.title,
        startDate: eventData.startDate,
        startTime: eventData.startTime,
        duration: eventData.duration,
        description: eventData.description,
        meetingId: meetingResult?.meetingId,
        joinUrl: meetingResult?.joinUrl,
        startUrl: meetingResult?.startUrl,
        createdAt: new Date().toISOString(),
        status: meetingResult ? 'created' : 'error',
      };

      setEvents(prev => [newEvent, ...prev]);
    } finally {
      setIsSubmitting(false);
    }
  }, [zoomStatus, createMeeting]);

  const isZoomConnected = zoomStatus?.isConnected ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-light/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary rounded-full p-3">
              <Video className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Zoom Integration POC
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Demonstração da integração com Zoom para criação automática de reuniões através de eventos.
            Conecte-se ao Zoom e crie eventos que geram reuniões automaticamente.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Zoom Connection Status */}
          <ZoomConnectionStatus
            zoomStatus={zoomStatus}
            isLoading={isLoading}
            error={error}
            onConnect={handleConnectZoom}
          />

          {/* Event Creation Form */}
          <EventForm
            isZoomConnected={isZoomConnected}
            onSubmit={handleCreateEvent}
            isSubmitting={isSubmitting}
          />

          {/* Events List */}
          <EventList events={events} />
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            POC - Integração Zoom • Demonstração das funcionalidades de backend implementadas
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;