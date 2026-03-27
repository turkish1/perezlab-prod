import { authService } from '@/services/authService';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const STORAGE_KEY = 'myapp_auth_v1';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null);
    const user = ref(null); // { id, name, email, roles: [] }
    const redirectAfterLogin = ref(null);
    const bootstrapped = ref(false);

    const isLoggedIn = computed(() => !!token.value);
    const roles = computed(() => user.value?.roles ?? []);
    const canAccessInternal = computed(() => roles.value.length > 0);

    function persist() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                token: token.value,
                user: user.value,
                redirectAfterLogin: redirectAfterLogin.value
            })
        );
    }

    function restore() {
        if (bootstrapped.value) return;
        bootstrapped.value = true;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            token.value = parsed.token ?? null;
            user.value = parsed.user ?? null;
            redirectAfterLogin.value = parsed.redirectAfterLogin ?? null;
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    function setRedirectAfterLogin(path) {
        redirectAfterLogin.value = path;
        persist();
    }

    function clearRedirectAfterLogin() {
        redirectAfterLogin.value = null;
        persist();
    }

    async function login({ username, password }) {
        const res = await authService.login(username, password);
        token.value = res.token;
        user.value = res.user;
        persist();
        return res.user;
    }

    async function logout() {
        try {
            await authService.logout();
        } finally {
            token.value = null;
            user.value = null;
            redirectAfterLogin.value = null;
            bootstrapped.value = true;
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    function hasAnyRole(required = []) {
        if (!required.length) return true;
        return required.some((r) => roles.value.includes(r));
    }

    return {
        token,
        user,
        redirectAfterLogin,
        bootstrapped,
        isLoggedIn,
        roles,
        canAccessInternal,
        restore,
        persist,
        setRedirectAfterLogin,
        clearRedirectAfterLogin,
        login,
        logout,
        hasAnyRole
    };
});
