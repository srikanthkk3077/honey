// Base API service simulation with fallback to local store/storage

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourhoney.com/v1';

export class ApiService {
  static async get<T>(endpoint: string): Promise<T> {
    // Simulated network delay for realistic UI loading states
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(`[API GET] ${API_BASE_URL}${endpoint}`);
    return {} as T;
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(`[API POST] ${API_BASE_URL}${endpoint}`, data);
    return data as T;
  }
}
