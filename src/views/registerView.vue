<script setup>
import useSigningAuth from '@/composables/signingApi.js';
import { useAuthStore } from '@/stores/authStore';
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();
const { register } = useSigningAuth();
const name = ref('');
const email = ref('');
const password = ref('');
const reg = reactive({
    name: '',
    email: '',
    password: ''
});
const error = ref('');

// we want push this to a composable and save it to the store.....
// to fix error of auth.register not existing?
async function submit() {
    error.value = '';

    try {
        console.log('Attempting registration with:', { name: name.value, email: email.value, password: password.value });
        reg.name = name.value;
        reg.email = email.value;
        reg.password = password.value;

        register(reg);
        router.push('/login');
    } catch (err) {
        error.value = err.message;
    }
}
</script>

<template>
    <main class="auth-page">
        <section class="auth-card">
            <h1>Create Account</h1>

            <form @submit.prevent="submit">
                <label>Name</label>
                <input v-model="name" type="text" />

                <label>Email</label>
                <input v-model="email" type="email" autocomplete="email" />

                <label>Password</label>
                <input v-model="password" type="password" autocomplete="new-password" />

                <p v-if="error" class="error">{{ error }}</p>

                <button type="submit" :disabled="auth.loading">
                    {{ auth.loading ? 'Creating...' : 'Register' }}
                </button>
            </form>

            <p>
                Already have an account?
                <RouterLink to="/login">Sign in</RouterLink>
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
</style>
