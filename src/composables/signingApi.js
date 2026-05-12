// composables/useSigningAuth.js
import axios from 'axios';
import { ref, unref } from 'vue';

const lambdaUrl = 'https://lj355itaf44nbu6qjvwizsl4ce0ilzuo.lambda-url.us-east-1.on.aws';

// Shared reactive token state across all instances
const accessToken = ref(localStorage.getItem('accessToken') || null);
const refreshTokenValue = ref(localStorage.getItem('refreshToken') || null);

function setTokens(access, refresh) {
    accessToken.value = access;
    refreshTokenValue.value = refresh;
    if (access) localStorage.setItem('accessToken', access);
    else localStorage.removeItem('accessToken');
    if (refresh) localStorage.setItem('refreshToken', refresh);
    else localStorage.removeItem('refreshToken');
}

function authHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (accessToken.value) {
        headers['Authorization'] = `Bearer ${accessToken.value}`;
    }
    return headers;
}

export default function useSigningAuth() {
    const loading = ref(false);
    const errors = ref(null);
    const successData = ref(null);

    async function request(path, payloadLike) {
        loading.value = true;
        errors.value = null;
        try {
            const payload = unref(payloadLike);
            const res = await axios.post(`${lambdaUrl}${path}`, payload, {
                headers: authHeaders()
            });
            successData.value = res.data;
            return res.data;
        } catch (err) {
            errors.value = err.response?.data || err.message;
            console.error(`[useSigningAuth] ${path} error:`, errors.value);
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // ---- Auth ----

    const register = async (payload) => {
        return await request('/register', payload);
    };

    const login = async (payload) => {
        const data = await request('/login', payload);
        if (data.accessToken && data.refreshToken) {
            setTokens(data.accessToken, data.refreshToken);
        }
        return data;
    };

    const refresh = async () => {
        const data = await request('/refresh', {
            refreshToken: refreshTokenValue.value
        });
        if (data.accessToken) {
            accessToken.value = data.accessToken;
            localStorage.setItem('accessToken', data.accessToken);
        }
        return data;
    };

    const logout = async () => {
        await request('/logout', {
            refreshToken: refreshTokenValue.value
        });
        setTokens(null, null);
    };

    // ---- Signing ----

    const createSigning = async (payload) => {
        return await request('/create-signing', payload);
    };

    const sign = async (payload) => {
        return await request('/sign', payload);
    };

    // ---- Audit ----

    const getAudit = async (entityId) => {
        return await request('/audit', { id: entityId });
    };

    return {
        loading,
        errors,
        successData,
        accessToken,
        register,
        login,
        refresh,
        logout,
        createSigning,
        sign,
        getAudit
    };
}
