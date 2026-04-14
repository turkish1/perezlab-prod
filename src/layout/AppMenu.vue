<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import AppMenuItem from './AppMenuItem.vue';

const route = useRoute();
const auth = useAuthStore();

/**
 * Decide which "world" we're in.
 * If you keep internal pages under /app/*, this is clean & fast.
 */
const isInternalArea = computed(() => route.path.startsWith('/app'));

/**
 * PUBLIC menu (customer-facing)
 * Keep it lean: Landing/About/FAQ/etc.
 */

const publicModel = [
    {
        label: 'Navigation',
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }, // or '/landing'
            { label: 'Orders', icon: 'pi pi-fw pi-briefcase', to: '/orders' },
            { label: 'About', icon: 'pi pi-fw pi-info-circle', to: '/about' },
            { label: 'FAQ', icon: 'pi pi-fw pi-question-circle', to: '/faq' }
        ]
    }
];
/**
 * INTERNAL menu (staff-facing)
 * Note: These paths assume you moved internal routes under /app/*
 * If you keep old paths (/orders), update the `to` paths accordingly.
 */
const internalModel = [
    {
        label: 'Internal',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            // { label: 'Products', icon: 'pi pi-fw pi-box', to: '/app/Products', roles: ['staff', 'admin'] },
            // { label: 'Ledger', icon: 'pi pi-fw pi-book', to: '/app/Ledger', roles: ['admin'] },
            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/app/uikit/table', roles: ['staff', 'admin'] },
            { label: 'Finished Product', icon: 'pi pi-fw pi-clipboard', to: '/app/uikit/finished-product', roles: ['staff', 'admin'] },
            { label: 'Raw Materials', icon: 'pi pi-fw pi-chart-scatter', to: '/app/uikit/inventory', roles: ['staff', 'admin'] },
            { label: 'Batches', icon: 'pi pi-fw pi-book', to: '/app/uikit/batch-table', roles: ['staff', 'admin'] }
        ]
    },

    { separator: true },
    {
        label: 'Exit',
        items: [{ label: 'Public site', icon: 'pi pi-fw pi-globe', to: '/' }]
    }
];

/**
 * Role filtering:
 * - If item has no roles => show it
 * - If it has roles => user must have at least one
 * Also filters empty groups.
 */
// function filterByRole(groups) {
//     return groups
//         .map((group) => {
//             if (group.separator) return group;

//             const items = (group.items ?? []).filter((item) => {
//                 const required = item.roles ?? [];
//                 return auth.hasAnyRole(required);
//             });

//             return { ...group, items };
//         })
//         .filter((group) => group.separator || (group.items?.length ?? 0) > 0);
// }
function filterByRole(groups) {
    return groups
        .map((group) => {
            if (group.separator) return group;

            const items = (group.items ?? []).filter((item) => {
                const required = item.roles;

                // ✅ NO roles = public item → always show
                if (!required || required.length === 0) {
                    return true;
                }

                // ✅ roles exist → check user
                return auth.hasAnyRole(required);
            });

            return { ...group, items };
        })
        .filter((group) => group.separator || (group.items?.length ?? 0) > 0);
}
const model = computed(() => {
    const base = isInternalArea.value ? internalModel : publicModel;
    return filterByRole(base);
});
// const model = computed(() => {
//     const base = isInternalArea.value ? internalModel : publicModel;
//     return filterByRole(base);
// });
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item.label ?? i">
            <app-menu-item v-if="!item.separator" :item="item" :index="i" />
            <li v-else class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped>
.layout-menu {
    display: block;
    width: fit-content;
}
</style>
