import proxy from './proxy';
import type { AxiosRequestConfig } from 'axios';

class ApiService {
  public static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await proxy.get<T>(url, config);
    return response.data;
  }

  public static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await proxy.post<T>(url, data, config);
    return response.data;
  }

  public static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await proxy.put<T>(url, data, config);
    return response.data;
  }

  public static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await proxy.patch<T>(url, data, config);
    return response.data;
  }

  public static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await proxy.delete<T>(url, config);
    return response.data;
  }
}

export default ApiService;
