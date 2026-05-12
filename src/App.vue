<!-- <script setup></script>

<template>
    <router-view />
</template>

<style scoped></style> -->

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

async function logout() {
    await auth.logout();
    router.push('/login');
}
</script>

<template>
    <div>
        <header class="nav" v-if="auth.isAuthenticated">
            <strong>Signing Site Admin</strong>

            <nav>
                <RouterLink to="/">Dashboard</RouterLink>
                <RouterLink to="/sessions">Sessions</RouterLink>
                <RouterLink v-if="auth.isAdmin" to="/auth-audit">Audit</RouterLink>
                <button @click="logout">Logout</button>
            </nav>
        </header>

        <router-view />
    </div>
</template>
