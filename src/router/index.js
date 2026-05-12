import AppLayout from '@/layout/AppLayout.vue';
import InternalLayout from '@/layout/InternalLayout.vue';
import { useAuthStore1 } from '@/stores/auth';
import { useAuthStore } from '@/stores/authStore';
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
                // { path: 'login', name: 'create-signing', meta: { public: true }, component: () => import('@/views/uikit/CreateSigningRequest.vue') },
                // { path: 'sign/:id', name: 'sign-document', meta: { public: true }, component: () => import('@/views/uikit/SignDocument.vue') },
                // { path: 'AuditTrail', name: 'audit-trail', meta: { public: true }, component: () => import('@/views/uikit/AuditTrail.vue') },

                // LOGIN AUTH PATHING
                { path: 'login', name: 'login-page', meta: { public: true }, component: () => import('@/views/LoginView.vue') },
                { path: 'register', name: 'register', meta: { public: true }, component: () => import('@/views/registerView.vue') },
                { path: 'sessions', name: 'sessions', meta: { requiresAuth: true }, component: () => import('@/views/SessionsView.vue') },
                // requiresAuth: true, adminOnly: true
                { path: 'auth-audit', name: 'auth-audit', meta: { public: true }, component: () => import('@/views/AuthAuditView.vue') },

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
                { path: 'uikit/cost', name: 'cost', meta: { roles: ['staff', 'admin'] }, component: () => import('@/views/uikit/costPage.vue') }
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

router.beforeEach(async (to) => {
    const auth = useAuthStore1();
    const auth2 = useAuthStore();
    // auth.restore();

    if (to.matched.some((r) => r.meta?.public)) return true;

    // Lets revisit this logic - we want to check if user is logged in, if not redirect to login and save intended path. If logged in but trying to access internal without permission, redirect to access denied. If trying to access role-restricted page without role, redirect to access denied. If trying to access admin-only page without admin, redirect to home.
    // const user = await auth2.fetchMe();
    // if (!user) {
    //     return '/login';
    // }

    if (!auth2.isLoggedIn) {
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

    if (to.meta.adminOnly && !auth.isAdmin) {
        return '/';
    }

    return true;
});

export default router;
