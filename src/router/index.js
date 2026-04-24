import AppLayout from '@/layout/AppLayout.vue';
import InternalLayout from '@/layout/InternalLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // PUBLIC/CUSTOMER AREA (your existing children)
        {
            path: '/',
            component: AppLayout,
            children: [
                { path: '', name: 'Home', meta: { public: true }, component: () => import('@/views/pages/Landing.vue') },
                { path: 'Orders', name: 'orders', meta: { public: true }, component: () => import('@/views/pages/OrderPageDoc.vue') },
                { path: 'about', name: 'about', meta: { public: true }, component: () => import('@/views/pages/About.vue') },
                { path: 'case-studies', name: 'case-studies', meta: { public: true }, component: () => import('@/views/pages/CaseStudiesView.vue') },
                { path: 'faq', name: 'faqs', meta: { public: true }, component: () => import('@/views/pages/FAQView.vue') }
            ]
        },

        // INTERNAL AREA (move internal routes here OR keep old paths and just mark meta)
        {
            path: '/app',
            component: InternalLayout,
            meta: { requiresAuth: true, internal: true },
            children: [
                { path: 'dashboard', name: 'dashboard', meta: { label: 'Dashboard', roles: ['staff', 'admin'] }, component: () => import('@/views/Dashboard.vue') },
                { path: 'Ledger', name: 'ledger', meta: { label: 'Ledger', roles: ['admin'] }, component: () => import('@/views/uikit/LedgerDoc.vue') },
                { path: 'uikit/capmmr', name: 'capmmr', meta: { label: 'CapMMR', roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchCapMMR.vue') },
                { path: 'uikit/inventory', name: 'inventory', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/InventoryPage.vue') },
                { path: 'uikit/input', name: 'input', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/InputDoc.vue') },
                { path: 'uikit/table', name: 'table', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/TableDoc.vue') },
                { path: 'uikit/status-page', name: 'StatusPage', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/StatusPage.vue') },
                { path: 'uikit/product-entry', name: 'product-entry', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/ProductEntryDoc.vue') },
                { path: 'uikit/product-exit', name: 'product-exit', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/ProductExitDoc.vue') },
                { path: 'uikit/finished-product', name: 'finished-product', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/FinishedProductDoc.vue') },
                { path: 'uikit/batch-table', name: 'batch-table', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchDoc.vue') },
                { path: 'uikit/batch-records', name: 'batch-records', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchRecDoc.vue') },
                { path: 'uikit/batch-weight', name: 'batch-weight', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchWeightDoc.vue') },
                { path: 'uikit/blending-records', name: 'blending-records', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchBlendDoc.vue') },
                { path: 'uikit/batch-order-records', name: 'batch-order-records', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchOrderDoc.vue') },
                { path: 'uikit/batch-cap-blend', name: 'batch-cap-blend', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchCapBlend.vue') },
                { path: 'uikit/batch-cap-weight', name: 'batch-cap-weight', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchCapWeight.vue') },
                { path: 'uikit/batch-cap-yield', name: 'batch-cap-yield', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/BatchCapYield.vue') },
                { path: 'uikit/cost', name: 'cost', meta: {roles: ['staff', 'admin']}, component: () => import('@/views/uikit/costPage.vue') }
            ]
        },

        // AUTH + ERROR
        { path: '/auth/login', name: 'login', meta: { public: true }, component: () => import('@/views/pages/auth/Login.vue') },
        { path: '/pages/upload', name: 'upload', meta: { public: true }, component: () => import('@/views/pages/UploadFile.vue') },
        { path: '/auth/access', name: 'accessDenied', meta: { public: true }, component: () => import('@/views/pages/auth/Access.vue') },
        { path: '/auth/error', name: 'error', meta: { public: true }, component: () => import('@/views/pages/auth/Error.vue') },
        { path: '/pages/notfound', name: 'notfound', meta: { public: true }, component: () => import('@/views/pages/NotFound.vue') },
        { path: '/:pathMatch(.*)*', redirect: '/pages/notfound' }
    ]
});

// import AppLayout from '@/layout/AppLayout.vue';
// import InternalLayout from '@/layout/InternalLayout.vue';
// import { useAuthStore } from '@/stores/auth';
// import { createRouter, createWebHistory } from 'vue-router';
// // This is a virtual module generated by the plugin
// import { routes as autoRoutes } from 'vue-router/auto-routes';

// const router = createRouter({
//     history: createWebHistory(),
//     routes: [
//         {
//             path: '/',
//             component: AppLayout,
//             // Filter autoRoutes to only include those intended for the public area
//             children: autoRoutes.filter((r) => !r.path.startsWith('/app'))
//         },
//         {
//             path: '/app',
//             component: InternalLayout,
//             meta: { requiresAuth: true, internal: true },
//             // Filter autoRoutes for internal area and apply default meta
//             children: autoRoutes
//                 .filter((r) => r.path.startsWith('/app'))
//                 .map((route) => ({
//                     ...route,
//                     path: route.path.replace('/app/', ''), // Strip prefix for nested path
//                     meta: { ...route.meta, roles: ['staff', 'admin'] }
//                 }))
//         },
//         // Keep your manual Auth/Error routes here if they don't follow the folder pattern
//         { path: '/auth/login', name: 'login', meta: { public: true }, component: () => import('@/views/pages/auth/Login.vue') },
//         { path: '/:pathMatch(.*)*', redirect: '/pages/notfound' }
//     ]
// });
// src/router/index.js

router.beforeEach((to) => {
    const auth = useAuthStore();

    // auth.restore();

    if (to.matched.some((r) => r.meta?.public)) return true;

    if (!auth.isLoggedIn) {
        auth.setRedirectAfterLogin(to.fullPath);
        return { name: 'login' };
    }

    if (to.meta?.internal && !auth.canAccessInternal) {
        return { name: 'accessDenied' };
    }

    const requiredRoles = to.meta?.roles || [];
    if (requiredRoles.length && !auth.hasAnyRole(requiredRoles)) {
        return { name: 'accessDenied' };
    }

    return true;
});

export default router;
