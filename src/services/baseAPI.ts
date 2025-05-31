
import { ApiError } from '../types/github';


export abstract class BaseAPI {
   protected baseUrl: string;
 
   constructor(baseUrl: string) {
     this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_GITHUB_API_URL || 'https://api.github.com';
   }
 
 protected getFetchConfig(): RequestInit {
     return {
       method: 'GET',
       headers: {
         'Accept': 'application/vnd.github.v3+json',
         'User-Agent': 'GitHub-Explorer-App/1.0',
       },
     };
   }
   protected createError(message: string, status: number): ApiError {
     return { message, status };
   }
 
   protected handleError(error: any, defaultMessage: string): never {
     if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
       throw this.createError('Network error or CORS issue. Please try again later.', 0);
     }
 
     throw this.createError(error.message || defaultMessage, error.status || 500);
   }
   protected async fetchWithErrorHandling<T>(url: string): Promise<T> {
     try {
       const response = await fetch(url, this.getFetchConfig());
 
       if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
 
         if (response.status === 403 && errorData.message?.includes('rate limit')) {
           throw this.createError('GitHub rate limit exceeded. Please try again later.', 403);
         }
 
         if (response.status === 404) {
           throw this.createError(errorData.message || 'Resource not found', 404);
         }
 
         if (response.status === 422) {
           throw this.createError(errorData.message || 'Validation failed', 422);
         }
 
         throw this.createError(
           errorData.message || `GitHub API error: ${response.status}`,
           response.status
         );
       }
 
       return await response.json();
     } catch (error: any) {
       this.handleError(error, 'Request failed');
     }
   }
 
   protected buildUrl(endpoint: string, params?: Record<string, string | number>): string {
     const url = new URL(`${this.baseUrl}${endpoint}`);
 
     if (params) {
       Object.entries(params).forEach(([key, value]) => {
         url.searchParams.append(key, String(value));
       });
     }
 
     return url.toString();
   }
}
