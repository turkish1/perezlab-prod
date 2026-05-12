<script setup>
import { authApi } from '@/composables/authApi';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, ref } from 'vue';

const auth = useAuthStore();

const logs = ref([]);
const error = ref('');

async function loadLogs() {
    try {
        const data = await authApi.authAudit(auth.accessToken);
        logs.value = data.logs;
    } catch (err) {
        error.value = err.message;
    }
}

onMounted(loadLogs);
</script>

<template>
    <main class="page">
        <h1>Authentication Audit Logs</h1>

        <p v-if="error" class="error">{{ error }}</p>

        <div class="card" v-for="log in logs" :key="log.id">
            <p><strong>Action:</strong> {{ log.action }}</p>
            <p><strong>User ID:</strong> {{ log.actorUserId }}</p>
            <p><strong>IP:</strong> {{ log.ipAddress }}</p>
            <p><strong>User Agent:</strong> {{ log.userAgent }}</p>
            <p><strong>Created:</strong> {{ log.createdAt }}</p>
            <pre>{{ log.metadata }}</pre>
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
    max-width: 1100px;
    margin: 0 auto 24px;
    color: #0f172a;
    font-size: 34px;
}

.card {
    max-width: 1100px;
    margin: 16px auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    padding: 22px;
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.07);
}

.card p:first-child {
    display: inline-block;
    padding: 7px 11px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 800;
}

p {
    margin: 9px 0;
    color: #334155;
    overflow-wrap: anywhere;
}

strong {
    color: #0f172a;
}

pre {
    background: #0f172a;
    color: #e5e7eb;
    padding: 14px;
    border-radius: 14px;
    overflow: auto;
}

.error {
    max-width: 1100px;
    margin: 0 auto 16px;
    padding: 12px;
    border-radius: 12px;
    background: #fef2f2;
    color: #b91c1c;
    font-weight: 700;
}
</style>
