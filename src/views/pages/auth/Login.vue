<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const username = ref('hugob');
// const email = ref('orders@perezlab.co');
const password = ref('password');
const loading = ref(false);
const error = ref('');

async function onSubmit() {
    error.value = '';
    loading.value = true;
    try {
        await auth.login({
            username: username.value,
            password: password.value
        });
        const target = auth.redirectAfterLogin || '/app/uikit/table';
        auth.clearRedirectAfterLogin();
        router.push(target);
    } catch (e) {
        error.value = e?.message || 'Login failed';
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div style="max-width: 420px; margin: 2rem auto; padding: 1rem; border: 1px solid #ddd; border-radius: 12px">
        <h2>Staff Login</h2>
        <!-- <p style="opacity: 0.8">Demo: <code>username</code> / <code>password</code></p> -->

        <form @submit.prevent="onSubmit" style="display: grid; gap: 12px; margin-top: 12px">
            <label>
                Username
                <!-- <input v-model="username" type="text" /> -->
                <input v-model="username" type="username" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 10px" />
            </label>
            <label>
                Password
                <input v-model="password" type="password" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 10px" />
            </label>

            <button :disabled="loading" style="padding: 10px; border-radius: 10px; border: 1px solid #ddd; background: #111; color: #fff">
                {{ loading ? 'Logging in…' : 'Login' }}
            </button>

            <div v-if="error" style="color: #b00020">{{ error }}</div>
        </form>
    </div>
</template>
