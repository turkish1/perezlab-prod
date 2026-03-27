import { ref } from 'vue';

export function useApi(baseUrl) {
    const loading = ref(false);
    const error = ref('');

    async function request(path, options = {}) {
        loading.value = true;
        error.value = '';

        try {
            const res = await fetch(`${baseUrl}${path}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {})
                },
                ...options
            });

            // try to parse json even on errors
            const text = await res.text();
            let data = null;
            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = text;
            }

            if (!res.ok) {
                const message = (data && (data.message || data.error)) || (typeof data === 'string' && data) || `Request failed (${res.status})`;
                throw new Error(message);
            }

            return data;
        } catch (e) {
            error.value = e.message || 'Request failed';
            throw e;
        } finally {
            loading.value = false;
        }
    }

    return { loading, error, request };
}
