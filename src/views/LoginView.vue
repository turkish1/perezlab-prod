<script setup>
import useSigningAuth from '@/composables/signingApi.js';
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
const router = useRouter();
const auth = useAuthStore();
const { login } = useSigningAuth();
const email = ref('');
const password = ref('');
const error = ref('');
const auths = reactive({
    loading: false,
    error: ''
});
//
const reg = reactive({
    email: '',
    password: ''
});
async function submit() {
    error.value = '';
    auths.loading = true;

    try {
        reg.email = email.value;
        reg.password = password.value;
        await login(reg);
        router.push('/app/uikit/table');
    } catch (err) {
        error.value = err.message;
    } finally {
        auths.loading = false;
    }
}
</script>

<template>
    <main class="auth-page">
        <section class="auth-card">
            <h1>Sign In</h1>

            <form @submit.prevent="submit">
                <label>Email</label>
                <input v-model="email" type="email" autocomplete="email" />

                <label>Password</label>
                <input v-model="password" type="password" autocomplete="current-password" />

                <p v-if="error" class="error">{{ error }}</p>
                <button type="submit" :disabled="auths.loading" class="signin-btn">
                    <span v-if="auths.loading" class="spinner"></span>

                    {{ auths.loading ? 'Signing In...' : 'Sign In' }}
                </button>
                <!-- <button type="submit" :disabled="auths.loading">
                    {{ auths.loading ? 'Signing in...' : 'Sign In' }}
                </button> -->
            </form>

            <p>
                No account?
                <RouterLink to="/register">Register</RouterLink>
            </p>
        </section>
    </main>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.18), transparent 35%), linear-gradient(135deg, #f8fafc, #e5e7eb);
    padding: 24px;
}

.auth-card {
    width: 100%;
    max-width: 430px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(229, 231, 235, 0.9);
    border-radius: 22px;
    padding: 34px;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
}

h1 {
    margin: 0 0 24px;
    font-size: 32px;
    color: #0f172a;
}

form {
    display: grid;
    gap: 14px;
}

label {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
}

input {
    width: 100%;
    padding: 14px 15px;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    font-size: 15px;
    outline: none;
}

input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

button {
    margin-top: 8px;
    border: none;
    border-radius: 14px;
    padding: 14px 18px;
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: white;
    font-weight: 800;
    cursor: pointer;
}

button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.error {
    padding: 12px;
    border-radius: 12px;
    background: #fef2f2;
    color: #b91c1c;
    font-weight: 700;
}

p {
    margin-top: 18px;
    color: #475569;
}

a {
    color: #2563eb;
    font-weight: 800;
    text-decoration: none;
}

.signin-btn {
    margin-top: 8px;
    border: none;
    border-radius: 14px;
    padding: 14px 18px;
    background: linear-gradient(135deg, #1d4ed8, #2563eb);
    color: white;
    font-weight: 800;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    transition: all 0.2s ease;
}

.signin-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 3px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
