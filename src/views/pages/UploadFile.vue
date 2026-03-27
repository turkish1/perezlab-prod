<script setup>
import UploadFile from '@/components/dashboard/UploadPage.vue';
</script>

<template>
    <div class="page">
        <header class="topbar">
            <div class="brand">
                <div class="title">Upload Important Files</div>
            </div>
        </header>

        <main class="content">
            <UploadFile />
        </main>
    </div>
</template>

<style scoped>
.page {
    min-height: 100vh;

    background-color: rgba(222, 231, 233, 0.1);
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
    background-color: rgba(219, 233, 237, 0.15);
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
    background-color: rgba(91, 186, 218, 0.15);

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
