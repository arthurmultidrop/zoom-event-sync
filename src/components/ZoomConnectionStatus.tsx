import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Video, Loader2 } from 'lucide-react';
import { ZoomIntegrationResponse } from '@/types/zoom';

interface ZoomConnectionStatusProps {
  zoomStatus: ZoomIntegrationResponse | null;
  isLoading: boolean;
  error: string | null;
  onConnect: () => void;
}

export const ZoomConnectionStatus = ({ 
  zoomStatus, 
  isLoading, 
  error, 
  onConnect 
}: ZoomConnectionStatusProps) => {
  const isConnected = zoomStatus?.isConnected ?? false;

  return (
    <Card className="bg-gradient-to-br from-primary-light to-card border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Video className="h-5 w-5 text-primary" />
          Conexão com Zoom
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando status da conexão...
          </div>
        ) : error ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              Erro: {error}
            </div>
            <Button 
              onClick={onConnect}
              className="w-full bg-primary hover:bg-primary-hover"
            >
              Tentar Conectar com Zoom
            </Button>
          </div>
        ) : isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-medium">Conectado ao Zoom</span>
              </div>
              <Badge variant="secondary" className="bg-success text-success-foreground">
                Ativo
              </Badge>
            </div>
            
            {zoomStatus && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nome:</span>
                  <span className="font-medium">{zoomStatus.userName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{zoomStatus.userEmail || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Conta:</span>
                  <span className="font-medium capitalize">{zoomStatus.accountType || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <XCircle className="h-4 w-4" />
              Não conectado ao Zoom
            </div>
            <Button 
              onClick={onConnect}
              className="w-full bg-primary hover:bg-primary-hover"
              size="lg"
            >
              <Video className="h-4 w-4 mr-2" />
              Conectar com Zoom
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Você será redirecionado para autorizar a integração com o Zoom
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};