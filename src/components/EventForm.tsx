import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Users, Loader2 } from 'lucide-react';
import { EventForm as EventFormData } from '@/types/zoom';
import { useToast } from '@/hooks/use-toast';

interface EventFormProps {
  isZoomConnected: boolean;
  onSubmit: (eventData: EventFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const EventForm = ({ isZoomConnected, onSubmit, isSubmitting }: EventFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    startDate: '',
    startTime: '',
    duration: 60,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data é obrigatória';
    } else {
      const selectedDate = new Date(formData.startDate + 'T' + (formData.startTime || '00:00'));
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.startDate = 'Data e hora devem ser futuras';
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Hora é obrigatória';
    }

    if (formData.duration < 15) {
      newErrors.duration = 'Duração mínima é 15 minutos';
    } else if (formData.duration > 1440) {
      newErrors.duration = 'Duração máxima é 24 horas (1440 minutos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isZoomConnected) {
      toast({
        title: "Conexão necessária",
        description: "Conecte-se ao Zoom antes de criar um evento",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Dados inválidos",
        description: "Corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      
      // Reset form on success
      setFormData({
        title: '',
        startDate: '',
        startTime: '',
        duration: 60,
        description: '',
      });
      setErrors({});
      
      toast({
        title: "Evento criado!",
        description: "Evento criado com sucesso e reunião Zoom gerada",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar evento",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary" />
          Criar Novo Evento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento *</Label>
            <Input
              id="title"
              placeholder="Digite o título do evento"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={errors.startDate ? 'border-destructive' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Hora *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className={`pl-10 ${errors.startTime ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos) *</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="duration"
                type="number"
                min="15"
                max="1440"
                step="15"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 60)}
                className={`pl-10 ${errors.duration ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.duration && (
              <p className="text-sm text-destructive">{errors.duration}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Mínimo: 15 minutos • Máximo: 24 horas (1440 minutos)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição para o evento (opcional)"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover"
            size="lg"
            disabled={!isZoomConnected || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando Evento...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Criar Evento
              </>
            )}
          </Button>

          {!isZoomConnected && (
            <p className="text-sm text-muted-foreground text-center">
              Conecte-se ao Zoom primeiro para criar eventos
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};