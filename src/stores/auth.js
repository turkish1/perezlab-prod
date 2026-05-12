import { defineStore } from 'pinia';

export const useAuthStore1 = defineStore('auth', {
    state: () => ({
        user: null,
        roles: [],
        isLoggedIn: false,
        canAccessInternal: false,
        redirectAfterLogin: null
    }),

    actions: {
        setUser(user) {
            this.user = user;
            this.roles = user.roles || [];
        },

        hasAnyRole(requiredRoles) {
            return this.roles.some((r) => requiredRoles.includes(r));
        },

        setRedirectAfterLogin(path) {
            this.redirectAfterLogin = path;
        },

        // ✅ Persist to localStorage
        save() {
            localStorage.setItem(
                'auth',
                JSON.stringify({
                    user: this.user,
                    roles: this.roles,
                    isLoggedIn: this.isLoggedIn,
                    canAccessInternal: this.canAccessInternal
                })
            );
        },

        // ✅ Restore on refresh
        restore() {
            const data = localStorage.getItem('auth');
            if (!data) return;

            const parsed = JSON.parse(data);
            this.user = parsed.user;
            this.roles = parsed.roles || [];
            this.isLoggedIn = parsed.isLoggedIn;
            this.canAccessInternal = parsed.canAccessInternal;
        },

        logout() {
            this.user = null;
            this.roles = [];
            this.isLoggedIn = false;
            this.canAccessInternal = false;
            localStorage.removeItem('auth');
        }
    }
});
