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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  firstName: string;
  image: string;
  language: string;
  urlImage: string;
  chatToken: string;
  userViewPreference: any; // Pode ser tipado mais especificamente se necessário
}

export interface AuthContextType {
  user: LoginResponse | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}