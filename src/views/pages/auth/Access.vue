<template>
    <div class="wrap">
        <div class="card">
            <h1>Access Denied</h1>
            <p>You’re logged in, but your account doesn’t have permission to view that page.</p>

            <div class="actions">
                <router-link class="btn ghost" to="/">Go to public site</router-link>
                <router-link v-if="auth.canAccessInternal" class="btn" to="/app/dashboard">Go to dashboard</router-link>
                <router-link v-else class="btn" to="/auth/login">Login as staff</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const auth = useAuthStore();
</script>

<style scoped>
.wrap {
    min-height: 60vh;
    display: grid;
    place-items: center;
    padding: 18px;
}
.card {
    width: min(560px, 100%);
    border: 1px solid #e5e5e5;
    border-radius: 18px;
    padding: 18px;
}
.actions {
    display: flex;
    gap: 10px;
    margin-top: 14px;
    flex-wrap: wrap;
}
.btn {
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid #ddd;
    background: #111;
    color: #fff;
    text-decoration: none;
}
.btn.ghost {
    background: transparent;
    color: inherit;
}
</style>

<!-- <script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
                    <div class="gap-4 flex flex-col items-center">
                        <div class="flex justify-center items-center border-2 border-orange-500 rounded-full" style="width: 3.2rem; height: 3.2rem">
                            <i class="text-orange-500 pi pi-fw pi-lock !text-2xl"></i>
                        </div>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">Access Denied</h1>
                        <span class="text-muted-color mb-8">You do not have the necessary permisions. Please contact admins.</span>
                        <img src="/demo/images/access/asset-access.svg" alt="Access denied" class="mb-8" width="80%" />
                        <div class="col-span-12 mt-8 text-center">
                            <Button as="router-link" label="Go to Dashboard" to="/" severity="warn" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template> -->
