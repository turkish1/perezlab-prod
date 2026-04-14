<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Test users
const testUsers = [
    { user: 'hugob', pass: 'password1', role: 'admin' },
    { user: 'allen', pass: 'allen1', role: 'staff' },
    { user: 'bibi', pass: 'manuel1', role: 'staff' },
    { user: 'xiomara', pass: 'manuel1', role: 'staff' },
    { user: 'clara', pass: 'manuel1', role: 'staff' }
];

async function onSubmit() {
    if (loading.value) return;

    error.value = '';
    loading.value = true;

    try {
        const inputUser = username.value.trim().toLowerCase();
        const inputPass = password.value.trim();

        const validUser = testUsers.find((u) => u.user.toLowerCase() === inputUser && u.pass === inputPass);

        if (!validUser) {
            throw new Error('Invalid username or password.');
        }

        // ✅ SET AUTH STATE (CRITICAL)
        auth.setUser({
            name: validUser.user,
            roles: [validUser.role]
        });
        auth.setUser({
            name: validUser.user,
            roles: [validUser.role]
        });

        auth.isLoggedIn = true;
        auth.canAccessInternal = true;

        auth.save();

        // 🔥 IMPORTANT: force state flush before navigation
        await router.isReady();

        console.log('Auth state set:', auth.isLoggedIn);

        // NOW navigate
        await router.push({ name: 'table' });
     

    } catch (e) {
        console.error(e);
        error.value = e.message || 'Login failed';
    } finally {
        loading.value = false;
    }
}
</script>
<template>
    <div style="max-width: 420px; margin: 2rem auto; padding: 1rem; border: 1px solid #ddd; border-radius: 12px">
        <h2>Staff Login</h2>

        <form @submit.prevent="onSubmit" style="display: grid; gap: 12px; margin-top: 12px">
            <label>
                Username
                <input v-model="username" type="text" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 10px" />
            </label>
            <label>
                Password
                <input v-model="password" type="password" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 10px" />
            </label>

            <Button type="submit" :disabled="loading" style="padding: 10px; border-radius: 10px; border: 1px solid #ddd; background: #111; color: #fff">
                {{ loading ? 'Logging in…' : 'Login' }}
            </Button>

            <div v-if="error" style="color: #b00020">{{ error }}</div>
        </form>
    </div>
</template>
