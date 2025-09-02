import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Copy, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { ZoomEvent } from '@/types/zoom';
import { useToast } from '@/hooks/use-toast';

interface EventListProps {
  events: ZoomEvent[];
}

export const EventList = ({ events }: EventListProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar para a área de transferência",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(dateObj);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum evento criado</h3>
          <p className="text-muted-foreground">
            Crie seu primeiro evento para ver a lista aqui
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Eventos Criados ({events.length})
      </h2>
      
      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge 
                  variant={event.status === 'created' ? 'default' : 'destructive'}
                  className={event.status === 'created' ? 'bg-success text-success-foreground' : ''}
                >
                  {event.status === 'created' ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Erro
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDateTime(event.startDate, event.startTime)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{formatDuration(event.duration)}</span>
                </div>
                
                {event.meetingId && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>ID: {event.meetingId}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(event.meetingId!, 'ID da reunião')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {event.description && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              )}

              {event.status === 'created' && (event.joinUrl || event.startUrl) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {event.joinUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.joinUrl, '_blank')}
                      className="flex-1 min-w-[120px]"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Entrar na Reunião
                    </Button>
                  )}
                  
                  {event.startUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.startUrl, '_blank')}
                      className="flex-1 min-w-[120px]"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Iniciar como Host
                    </Button>
                  )}
                  
                  {event.joinUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(event.joinUrl!, 'Link da reunião')}
                      className="px-3"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Criado em: {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(event.createdAt))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};