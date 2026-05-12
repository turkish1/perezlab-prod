import { authApi } from '@/composables/authApi';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
        accessToken: localStorage.getItem('access_token') || '',
        refreshToken: localStorage.getItem('refresh_token') || '',
        loading: false,
        error: ''
    }),

    getters: {
        isAuthenticated: (state) => !!state.accessToken && !!state.user,
        isAdmin: (state) => state.user?.role === 'admin'
    },

    actions: {
        saveSession({ accessToken, refreshToken, user }) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.user = user;

            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('auth_user', JSON.stringify(user));
        },

        clearSession() {
            this.user = null;
            this.accessToken = '';
            this.refreshToken = '';

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('auth_user');
        },

        async register(payload) {
            this.loading = true;
            this.error = '';
            console.log('Registration successful:', payload);

            try {
                const data = await authApi.register(payload);
                console.log('Registration successful:', data);
            } catch (err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async login(email, password) {
            this.loading = true;
            this.error = '';

            try {
                const data = await authApi.login({ email, password });

                this.saveSession({
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: data.user
                });

                return data;
            } catch (err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async refreshAccessToken() {
            if (!this.refreshToken) {
                this.clearSession();
                return null;
            }

            try {
                const data = await authApi.refresh(this.refreshToken);
                this.accessToken = data.accessToken;
                localStorage.setItem('access_token', data.accessToken);
                return data.accessToken;
            } catch {
                this.clearSession();
                return null;
            }
        },

        async fetchMe() {
            if (!this.accessToken) return null;

            try {
                const data = await authApi.me(this.accessToken);
                this.user = data.user;
                localStorage.setItem('auth_user', JSON.stringify(data.user));
                return data.user;
            } catch {
                const newToken = await this.refreshAccessToken();

                if (!newToken) return null;

                const data = await authApi.me(newToken);
                this.user = data.user;
                localStorage.setItem('auth_user', JSON.stringify(data.user));
                return data.user;
            }
        },

        async logout() {
            try {
                if (this.refreshToken) {
                    await authApi.logout(this.refreshToken);
                }
            } finally {
                this.clearSession();
            }
        }
    }
});
