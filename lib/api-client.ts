import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '@/types';

// Token response structure from your backend
interface TokenResponseDto {
	accessToken: string;
	refreshToken: string;
	accessTokenExpiration: string; // DateTime as ISO string
	refreshTokenExpiration: string; // DateTime as ISO string
	userId: string; // Guid as string
	email: string;
	firstName: string;
	lastName: string;
}

class ApiClient {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL:
				process.env.NEXT_PUBLIC_API_URL ||
				'https://localhost:7001/api/v1',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		// Request interceptor for auth token
		this.client.interceptors.request.use(
			(config) => {
				const token = this.getAuthToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		// Response interceptor for error handling
		this.client.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error) => {
				if (error.response?.status === 401) {
					// Try to refresh token
					const refreshed = await this.handleTokenRefresh();
					if (refreshed && error.config) {
						// Retry the original request
						return this.client.request(error.config);
					} else {
						// Clear auth data and redirect to login
						this.clearAuthData();
						if (typeof window !== 'undefined') {
							window.location.href = '/auth/login';
						}
					}
				}
				return Promise.reject(this.handleError(error));
			}
		);
	}

	private getAuthToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem('accessToken');
	}

	private getRefreshToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem('refreshToken');
	}
	private async handleTokenRefresh(): Promise<boolean> {
		try {
			const refreshToken = this.getRefreshToken();
			if (!refreshToken) return false;

			const response = await axios.post(
				`${this.client.defaults.baseURL}/auth/refresh-token`,
				{
					refreshToken,
				}
			);

			console.log('Refresh token response:', response.data); // Debug log

			const tokenData: TokenResponseDto = response.data;
			this.setTokens(tokenData);
			return true;
		} catch (error) {
			console.error('Token refresh failed:', error); // Debug log
			return false;
		}
	}
	private setTokens(tokenData: TokenResponseDto): void {
		if (typeof window === 'undefined') return;

		console.log('Token data received:', tokenData); // Debug log

		localStorage.setItem('accessToken', tokenData.accessToken);
		localStorage.setItem('refreshToken', tokenData.refreshToken);

		// Convert DateTime string to timestamp
		const expirationDate = new Date(tokenData.accessTokenExpiration);
		const expirationTime = expirationDate.getTime();

		console.log(
			'Setting token expiry:',
			expirationTime,
			'Current time:',
			Date.now()
		); // Debug log
		console.log('Expiry date:', expirationDate.toISOString()); // Debug log

		localStorage.setItem('tokenExpiry', expirationTime.toString());

		// Store user info from token response
		const userInfo = {
			userId: tokenData.userId,
			email: tokenData.email,
			firstName: tokenData.firstName,
			lastName: tokenData.lastName,
		};
		localStorage.setItem('userInfo', JSON.stringify(userInfo));
	}
	private clearAuthData(): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('tokenExpiry');
		localStorage.removeItem('user');
		localStorage.removeItem('userInfo');
	}

	private handleError(error: any): ApiError {
		const defaultMessage = 'An unexpected error occurred';

		if (error.response?.data) {
			// Handle validation errors from your backend
			if (error.response.data.errors) {
				const validationErrors = Object.values(
					error.response.data.errors
				).flat();
				return {
					code: 'VALIDATION_ERROR',
					message: validationErrors.join(', '),
					details: error.response.data,
				};
			}

			return {
				code: error.response.data.type || 'API_ERROR',
				message:
					error.response.data.title ||
					error.response.data.message ||
					defaultMessage,
				details: error.response.data,
			};
		}

		return {
			code: 'NETWORK_ERROR',
			message: error.message || defaultMessage,
			details: error,
		};
	}

	// HTTP methods that work directly with your backend
	async post<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.client.post<T>(url, data, config);
		return response.data;
	}

	async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.client.get<T>(url, config);
		return response.data;
	}

	async put<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.client.put<T>(url, data, config);
		return response.data;
	}

	async delete<T = any>(
		url: string,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.client.delete<T>(url, config);
		return response.data;
	}

	async patch<T = any>(
		url: string,
		data?: any,
		config?: AxiosRequestConfig
	): Promise<T> {
		const response = await this.client.patch<T>(url, data, config);
		return response.data;
	}

	// Auth-specific methods
	async login(credentials: {
		email: string;
		password: string;
	}): Promise<TokenResponseDto> {
		return this.post<TokenResponseDto>('/auth/login', credentials);
	}

	async register(userData: {
		firstName: string;
		lastName: string;
		username: string;
		email: string;
		password: string;
		acceptTerms: boolean;
	}): Promise<TokenResponseDto> {
		return this.post<TokenResponseDto>('/auth/register', userData);
	}

	async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
		return this.post<TokenResponseDto>('/auth/refresh-token', {
			refreshToken,
		});
	}

	async logout(): Promise<void> {
		return this.post<void>('/auth/logout');
	}

	async getCurrentUser(): Promise<{
		userId: string;
		email: string;
		roles: string[];
	}> {
		return this.get('/auth/me');
	}

	// Bidding endpoints
	async placeBid(auctionId: string, amount: number, connectionId?: string): Promise<any> {
		const headers: Record<string, string> = {};
		if (connectionId) {
			headers['X-ConnectionId'] = connectionId;
		}
		
		return this.post(`/bids`, {
			auctionId,
			amount
		}, { headers });
	}

	async getAuctionBids(auctionId: string, page: number = 1, pageSize: number = 20): Promise<any> {
		return this.get(`/bids/auction/${auctionId}?page=${page}&pageSize=${pageSize}`);
	}

	async getAuctionStats(auctionId: string): Promise<any> {
		return this.get(`/bids/auction/${auctionId}/stats`);
	}

	// Utility methods for token management
	public getTokens() {
		if (typeof window === 'undefined') return null;
		return {
			accessToken: localStorage.getItem('accessToken'),
			refreshToken: localStorage.getItem('refreshToken'),
			tokenExpiry: localStorage.getItem('tokenExpiry'),
		};
	}

	public setAuthTokens(tokenData: TokenResponseDto) {
		this.setTokens(tokenData);
	}

	public clearAuth() {
		this.clearAuthData();
	}
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
