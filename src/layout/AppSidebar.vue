<script setup>
import AppMenu from '@/layout/AppMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const auth = useAuthStore();

const isInternalArea = computed(() => route.path.startsWith('/app'));

const model = computed(() => {
    const base = isInternalArea.value ? internalMenuModel : publicMenuModel;

    // Filter by role if present
    return base
        .map((group) => ({
            ...group,
            items: (group.items ?? []).filter((item) => {
                const required = item.roles ?? [];
                return auth.hasAnyRole(required);
            })
        }))
        .filter((group) => (group.items ?? []).length > 0);
});
</script>

<template>
    <div class="layout-sidebar">
        <AppMenu />
    </div>
</template>

<style lang="scss" scoped>
.layout-sidebar {
    display: block;
    width: 200px;
}
</style>
