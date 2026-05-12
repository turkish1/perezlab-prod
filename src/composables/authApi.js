const API_URL = 'https://lj355itaf44nbu6qjvwizsl4ce0ilzuo.lambda-url.us-east-1.on.aws/';

async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
        },
        body: JSON.stringify(options.body || {})
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

export const authApi = {
    register(payload) {
        return request('/register', { body: payload });
    },

    login(payload) {
        return request('/login', { body: payload });
    },

    refresh(refreshToken) {
        return request('/refresh', {
            body: { refreshToken }
        });
    },

    logout(refreshToken) {
        return request('/logout', {
            body: { refreshToken }
        });
    },

    me(accessToken) {
        return request('/me', {
            token: accessToken
        });
    },

    sessions(accessToken) {
        return request('/sessions', {
            token: accessToken
        });
    },

    revokeAllSessions(accessToken) {
        return request('/revoke-all-sessions', {
            token: accessToken
        });
    },

    authAudit(accessToken, actorUserId = null) {
        return request('/auth-audit', {
            token: accessToken,
            body: actorUserId ? { actorUserId } : {}
        });
    }
};
