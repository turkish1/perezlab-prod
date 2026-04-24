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
            { label: 'CapOrders', icon: 'pi pi-fw pi-box', to: '/app/uikit/capmmr', roles: ['staff', 'admin'] },
            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/app/uikit/table', roles: ['staff', 'admin'] },
            { label: 'Finished Product', icon: 'pi pi-fw pi-clipboard', to: '/app/uikit/finished-product', roles: ['staff', 'admin'] },
            { label: 'Raw Materials', icon: 'pi pi-fw pi-chart-scatter', to: '/app/uikit/inventory', roles: ['staff', 'admin'] },
            { label: 'Batch Records', icon: 'pi pi-fw pi-calculator', to: '/app/uikit/batch-records', roles: ['admin', 'staff'] },
            { label: 'Batch Weight', icon: 'pi pi-fw pi-gauge', to: '/app/uikit/batch-weight', roles: ['admin', 'staff'] },
            { label: 'Blending', icon: 'pi pi-fw pi-filter-fill', to: '/app/uikit/blending-records', roles: ['staff', 'admin'] },
            { label: 'TabletOrders', icon: 'pi pi-fw pi-bitcoin', to: '/app/uikit/batch-order-records', roles: ['staff', 'admin'] },
            { label: 'Batch Cap Blending', icon: 'pi pi-fw pi-filter-fill', to: '/app/uikit/batch-cap-blend', roles: ['staff', 'admin'] },
            { label: 'Batch Cap Weight', icon: 'pi pi-fw pi-gauge', to: '/app/uikit/batch-cap-weight', roles: ['staff', 'admin'] },
            { label: 'Batch Cap Yield', icon: 'pi pi-fw pi-percentage', to: '/app/uikit/batch-cap-yield', roles: ['staff', 'admin'] },
            { label: 'Cost Page', icon: 'pi pi-fw pi-dollar', to: '/app/uikit/cost', roles: ['staff', 'admin']}
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

<!--
<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter(); // Added this
const auth = useAuthStore();

const isInternalArea = computed(() => route.path.startsWith('/app'));

/**
 * AUTOMATED INTERNAL MODEL
 * This looks at your router config and picks up anything under /app
 */
const automatedInternalModel = computed(() => {
    // 1. Get the 'Internal Area' parent route
    const internalRoot = router.getRoutes().find((r) => r.path === '/app');

    if (!internalRoot || !internalRoot.children) return [];

    // 2. Map children to the menu format
    const items = internalRoot.children
        .filter((child) => child.meta?.label) // Only show routes that have a label
        .map((child) => ({
            label: child.meta.label,
            icon: child.meta.icon || 'pi pi-fw pi-circle', // Default icon
            to: `/app/${child.path}`,
            roles: child.meta.roles
        }));

    return [
        {
            label: 'Internal',
            icon: 'pi pi-fw pi-briefcase',
            items: items
        },
        { separator: true },
        {
            label: 'Exit',
            items: [{ label: 'Public site', icon: 'pi pi-fw pi-globe', to: '/' }]
        }
    ];
});

const publicModel = [
    {
        label: 'Navigation',
        items: [
            { label: 'Home', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Orders', icon: 'pi pi-fw pi-briefcase', to: '/orders' },
            { label: 'About', icon: 'pi pi-fw pi-info-circle', to: '/about' },
            { label: 'FAQ', icon: 'pi pi-fw pi-question-circle', to: '/faq' }
        ]
    }
];

// Re-using your excellent filter logic
function filterByRole(groups) {
    return groups
        .map((group) => {
            if (group.separator) return group;
            const items = (group.items ?? []).filter((item) => {
                const required = item.roles;
                if (!required || required.length === 0) return true;
                return auth.hasAnyRole(required);
            });
            return { ...group, items };
        })
        .filter((group) => group.separator || (group.items?.length ?? 0) > 0);
}

const model = computed(() => {
    // Use the automated internal model instead of the hardcoded one
    const base = isInternalArea.value ? automatedInternalModel.value : publicModel;
    return filterByRole(base);
});
</script> -->
