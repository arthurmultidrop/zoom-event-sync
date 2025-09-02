export interface ZoomIntegrationResponse {
  userId: string;
  accountId: string;
  accountType: string;
  isConnected: boolean;
  userEmail?: string;
  userName?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface EventForm {
  title: string;
  startDate: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  duration: number; // minutes
  description?: string;
}

export interface ZoomEvent {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  duration: number;
  description?: string;
  meetingId?: string;
  joinUrl?: string;
  startUrl?: string;
  createdAt: string;
  status: 'created' | 'error';
}

export interface CreateMeetingRequest {
  topic: string;
  startTime: string; // ISO 8601 format
  duration: number;
}

export interface CreateMeetingResponse {
  meetingId: string;
  joinUrl?: string;
  startUrl?: string;
}