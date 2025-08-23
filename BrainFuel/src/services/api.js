const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Projects API
    async getProjects(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/projects?${queryString}`);
    }

    async getTrendingProjects() {
        return this.request('/projects/trending');
    }

    async getProject(id) {
        return this.request(`/projects/${id}`);
    }

    async createProject(projectData) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData),
        });
    }

    async updateProject(id, projectData) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
    }

    async deleteProject(id) {
        return this.request(`/projects/${id}`, {
            method: 'DELETE',
        });
    }

    async supportProject(id, userId) {
        return this.request(`/projects/${id}/support`, {
            method: 'POST',
            body: JSON.stringify({ userId }),
        });
    }

    // Users API
    async register(userData) {
        const response = await this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async login(credentials) {
        const response = await this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    async logout() {
        this.setToken(null);
    }

    async getProfile() {
        return this.request('/users/profile');
    }

    async updateProfile(profileData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async getUserProjects() {
        return this.request('/users/projects');
    }

    async getSupportedProjects() {
        return this.request('/users/supported');
    }

    // Categories API
    async getCategories() {
        return this.request('/categories');
    }

    async getCategoriesWithCounts() {
        return this.request('/categories/with-counts');
    }

    async getCategory(id) {
        return this.request(`/categories/${id}`);
    }

    async createCategory(categoryData) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async updateCategory(id, categoryData) {
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    }

    async deleteCategory(id) {
        return this.request(`/categories/${id}`, {
            method: 'DELETE',
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService; 