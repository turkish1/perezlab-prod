<script setup>
import { authApi } from '@/composables/authApi';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const sessions = ref([]);
const error = ref('');

async function loadSessions() {
    try {
        const data = await authApi.sessions(auth.accessToken);
        sessions.value = data.sessions;
    } catch (err) {
        error.value = err.message;
    }
}

async function revokeAll() {
    try {
        await authApi.revokeAllSessions(auth.accessToken);
        auth.clearSession();
        router.push('/login');
    } catch (err) {
        error.value = err.message;
    }
}

onMounted(loadSessions);
</script>

<template>
    <main class="page">
        <h1>Active Sessions</h1>

        <p v-if="error" class="error">{{ error }}</p>

        <button @click="revokeAll">Revoke All Sessions</button>

        <div class="card" v-for="session in sessions" :key="session.id">
            <p><strong>Status:</strong> {{ session.status }}</p>
            <p><strong>IP:</strong> {{ session.ipAddress }}</p>
            <p><strong>User Agent:</strong> {{ session.userAgent }}</p>
            <p><strong>Created:</strong> {{ session.createdAt }}</p>
            <p><strong>Expires:</strong> {{ session.expiresAt }}</p>
            <p><strong>Revoked:</strong> {{ session.revokedAt || 'No' }}</p>
        </div>
    </main>
</template>

<style scoped>
.page {
    min-height: calc(100vh - 64px);
    padding: 40px 24px;
    background: #f8fafc;
}

h1 {
    max-width: 1050px;
    margin: 0 auto 20px;
    color: #0f172a;
    font-size: 34px;
}

button {
    display: block;
    max-width: 1050px;
    margin: 0 auto 24px;
    border: none;
    border-radius: 14px;
    padding: 13px 18px;
    background: #dc2626;
    color: white;
    font-weight: 800;
    cursor: pointer;
}

.card {
    max-width: 1050px;
    margin: 16px auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-left: 6px solid #2563eb;
    border-radius: 18px;
    padding: 22px;
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.07);
}

p {
    margin: 8px 0;
    color: #334155;
    overflow-wrap: anywhere;
}

strong {
    color: #0f172a;
}

.error {
    max-width: 1050px;
    margin: 0 auto 16px;
    padding: 12px;
    border-radius: 12px;
    background: #fef2f2;
    color: #b91c1c;
    font-weight: 700;
}
</style>
