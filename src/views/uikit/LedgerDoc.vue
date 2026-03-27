<script setup>
// import IngredientsPanel from './components/IngredientsPanel.vue';
// import OrdersPanel from './components/OrdersPanel.vue';
// import ProductsPanel from './components/ProductsPanel.vue';
// import { useApi } from './composables/useApi';
// import Ledger from '@/components/ledger/Ledger.vue';
// 🔧 Put your Lambda base URL here (no trailing slash)
// const API_BASE = 'https://YOUR_LAMBDA_BASE_URL';

// const tab = ref('products'); // "ingredients" | "products" | "orders"

// const ingredients = ref([]);
// const products = ref([]);
// const orders = ref([]);

// const api = useApi(API_BASE);

// async function loadIngredients() {
//     ingredients.value = (await api.request('/ingredients', { method: 'GET' })) || [];
// }

// async function loadProducts() {
//     products.value = (await api.request('/products', { method: 'GET' })) || [];
// }

// async function loadOrders() {
//     orders.value = (await api.request('/orders', { method: 'GET' })) || [];
// }

// async function refreshAll() {
//     await Promise.allSettled([loadIngredients(), loadProducts(), loadOrders()]);
// }

// onMounted(async () => {
//     await refreshAll();
// });
</script>

<template>
    <div class="page">
        <header class="topbar">
            <div class="brand">
                <div class="title">Nutraceutical Admin Ledger</div>
                <!-- <div class="sub">Products • Ingredients • Orders</div> -->
            </div>

            <!-- <nav class="tabs">
                <button :class="{ active: tab === 'ingredients' }" @click="tab = 'ingredients'">Ingredients</button>
                <button :class="{ active: tab === 'products' }" @click="tab = 'products'">Products</button>
                <button :class="{ active: tab === 'orders' }" @click="tab = 'orders'">Orders</button>
            </nav> -->
        </header>

        <main class="content">
            <!-- <div v-if="api.error" class="banner error">Error: {{ api.error }}</div>
            <div v-if="api.loading" class="banner loading">Loading...</div> -->
            <Ledger />
            <!-- <IngredientsPanel v-if="tab === 'ingredients'" :apiBase="API_BASE" :ingredients="ingredients" @refresh="loadIngredients" />

            <ProductsPanel v-if="tab === 'products'" :apiBase="API_BASE" :products="products" :ingredients="ingredients" @refreshProducts="loadProducts" @refreshIngredients="loadIngredients" />

            <OrdersPanel v-if="tab === 'orders'" :apiBase="API_BASE" :orders="orders" :products="products" @refresh="loadOrders" /> -->
        </main>
    </div>
</template>

<!-- <style scoped>
.page {
    min-height: 100vh;
    background: #0f1216;
    color: #e9eef5;
    font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
}
.topbar {
    display: flex;
    gap: 16px;
    align-items: flex-end;
    justify-content: space-between;
    padding: 18px 18px 12px 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    position: sticky;
    top: 0;
    background: #0f1216;
    z-index: 10;
}
.title {
    font-size: 18px;
    font-weight: 800;
}
.sub {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 4px;
}
.tabs {
    display: flex;
    gap: 8px;
}
.tabs button {
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    color: inherit;
    cursor: pointer;
}
.tabs button.active {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.22);
}
.content {
    padding: 18px;
    max-width: 1100px;
    margin: 0 auto;
}
.banner {
    padding: 10px 12px;
    border-radius: 10px;
    margin-bottom: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
}
.banner.error {
    background: rgba(255, 0, 0, 0.08);
}
.banner.loading {
    background: rgba(255, 255, 255, 0.06);
}
</style> -->
