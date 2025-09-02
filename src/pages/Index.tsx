import { useState, useCallback } from 'react';
import { ZoomConnectionStatus } from '@/components/ZoomConnectionStatus';
import { EventForm } from '@/components/EventForm';
import { EventList } from '@/components/EventList';
import { useZoom } from '@/hooks/useZoom';
import { useAuth } from '@/contexts/AuthContext';
import { EventForm as EventFormData, ZoomEvent } from '@/types/zoom';
import { Video, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const { zoomStatus, isLoading, error, connectToZoom, createMeeting } = useZoom();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<ZoomEvent[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnectZoom = useCallback(() => {
    connectToZoom('1'); // Using user ID 1 for this POC
  }, [connectToZoom]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

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
      {/* Header com usuário */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Video className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-primary">
                Zoom Integration POC
              </h1>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.urlImage} alt={user?.firstName} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">{user?.firstName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.image}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header principal */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary rounded-full p-3">
              <Video className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Bem-vindo, {user?.firstName}!
            </h2>
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