import ApiService from './api-service';

export interface ApiLog {
  id: number;
  method: string;
  url: string;
  statusCode: number | null;
  duration: number | null;
  ip: string | null;
  userAgent: string | null;
  requestBody: string | null;
  responseBody: string | null;
  createdAt: string;
}

class ApiLogService {
  public static async getLogs(limit = 100): Promise<ApiLog[]> {
    return ApiService.get<ApiLog[]>(`/api-logs?limit=${limit}`);
  }

  public static async clearLogs(): Promise<void> {
    return ApiService.delete('/api-logs');
  }
}

export default ApiLogService;
