<script setup>
import ProductExit from '@/components/dataentry/ProductExit.vue';
</script>

<template>
    <div class="page">
        <header class="topbar">
            <div class="brand">
                <div class="title">Nutraceutical Admin</div>
            </div>
        </header>

        <main class="content">
            <ProductExit />
        </main>
    </div>
</template>

<style scoped>
.page {
    min-height: 100vh;
    /* background: #0f1216;
    color: #e9eef5; */
    background-color: rgba(174, 180, 181, 0.1);
    backdrop-filter: blur(15px);
    border-radius: 12px;
    border: 1px solid rgba(102, 198, 203, 0.3);
    box-shadow: 0 0 25px rgba(135, 206, 250, 0.4);
    color: var(--black-color);
    font-family:
        ui-sans-serif,
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial;
}
.clear-pane:hover {
    background-color: rgba(173, 216, 230, 0.15);
    box-shadow: 0 0 30px rgba(135, 206, 250, 0.6);
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
    background-color: rgba(173, 216, 230, 0.15);

    /* background: #0f1216; */
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
</style>
