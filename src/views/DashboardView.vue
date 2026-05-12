<script setup>
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();
</script>

<template>
    <main class="page">
        <h1>Dashboard</h1>

        <div class="card">
            <h2>Welcome, {{ auth.user?.name }}</h2>
            <p>Email: {{ auth.user?.email }}</p>
            <p>Role: {{ auth.user?.role }}</p>
            <p>Status: {{ auth.user?.status }}</p>
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
    max-width: 980px;
    margin: 0 auto 24px;
    color: #0f172a;
    font-size: 34px;
}

.card {
    max-width: 980px;
    margin: 0 auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 22px;
    padding: 30px;
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
}

h2 {
    margin: 0 0 18px;
    font-size: 24px;
    color: #111827;
}

p {
    padding: 12px 0;
    margin: 0;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    font-size: 16px;
}

p:last-child {
    border-bottom: none;
}
</style>
