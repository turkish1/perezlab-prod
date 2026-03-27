<script setup>
import pullInventory from '@/composables/getlogic/pullInventory.js';
import { useInventoryStore } from '@/stores/useInventoryStore.js';
import { FilterMatchMode } from '@primevue/core/api';
import { storeToRefs } from 'pinia';
import { onMounted, ref, unref, watch } from 'vue';

import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';

const purchases = ref([]);
const totalRecords = ref(0);
const loading = ref(true);

// used only for "flash new" effect between refreshes
const previousKeys = ref(new Set());

const inventoryStore = useInventoryStore();
const { inputdata } = storeToRefs(inventoryStore);

const lazyParams = ref({
    page: 0,
    rows: 10,
    filters: { global: { value: null, matchMode: FilterMatchMode.CONTAINS } }
});

const { callFunction } = pullInventory();

const loadLazyData = () => {
    loading.value = true;
    callFunction();
};
function getRowClass(data) {
    // start with what you already use
    const classes = [data.flashClass, data.filledClass].filter(Boolean);

    // OPTIONAL: If a row is filled, you can either:
    // A) keep the color coding (comment out the next 2 lines)
    // B) force filled rows to look filled (recommended)
    if (data.status === 'filled') return classes;

    const qty = Number(data.quantity) || 0;

    // Quantity-based color bands (edit thresholds as you like)
    if (qty >= 10000)
        classes.push('row-large'); // green
    else if (qty >= 1000)
        classes.push('row-medium'); // yellow
    else classes.push('row-small'); // blue

    // "Recent" indicator (created within 24 hours)
    if (data.created_at) {
        const created = new Date(data.created_at);
        if (!Number.isNaN(created.getTime())) {
            const hours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
            if (hours <= 24) classes.push('row-recent');
        }
    }

    return classes;
}
const exportCSV = () => {
    const dataToExport = window.__FLAT_DATA__ || [];
    if (!dataToExport.length) return;

    const headers = ['Product', 'Order Date', 'Form', 'Qty', 'Bottle Size', 'Bottle Color', 'Cap Color', 'Cap Size', 'Capsule Size', 'Status'];

    const rows = dataToExport.map((r) => [r.product_name ?? '', r.created_at ?? '', r.dosage_form ?? '', r.quantity ?? '', r.bottle_size ?? '', r.bottle_color ?? '', r.cap_color ?? '', r.cap_size ?? '', r.capsule_size ?? '', r.status ?? '']);

    const csvContent = [headers, ...rows].map((row) => row.map((x) => `"${String(x).replaceAll('"', '""')}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inventory_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
};

onMounted(() => {
    loading.value = true;
    callFunction();
});

const toggleFilled = async (rowData) => {
    const idToUpdate = rowData.mongo_id || rowData._id || rowData.id;
    if (!idToUpdate) return;

    rowData.filledClass = rowData.status === 'filled' ? 'row-filled' : '';

    // TODO: call PATCH lambda here
};
/**
 * Normalize any backend shape into a plain array of Mongo documents.
 * Handles shapes like:
 *  - [ { _id, ... }, { _id, ... } ]
 *  - { inventory: [ ... ] }
 *  - [ { inventory: [ ... ] }, ... ]
 *  - [ { inventoryData: { inventory: [ ... ] } }, ... ]
 */
function normalizeInputToDocs(raw) {
    const out = [];

    const pushDocs = (docs) => {
        if (!Array.isArray(docs)) return;
        for (const d of docs) out.push(d);
    };

    // If store keeps { inventory: [...] }
    if (raw?.inventory && Array.isArray(raw.inventory)) {
        pushDocs(raw.inventory);
        return out;
    }

    // If it’s already a list
    if (Array.isArray(raw)) {
        for (const item of raw) {
            if (item?.inventoryData?.inventory && Array.isArray(item.inventoryData.inventory)) {
                pushDocs(item.inventoryData.inventory);
            } else if (item?.inventory && Array.isArray(item.inventory)) {
                pushDocs(item.inventory);
            } else {
                // assume item is a Mongo document
                out.push(item);
            }
        }
        return out;
    }

    // Some stores wrap in .value or .data
    if (raw?.value) return normalizeInputToDocs(raw.value);
    if (raw?.data) return normalizeInputToDocs(raw.data);

    return out;
}

// DEDUPE RULE: 1 row == 1 MongoDB document
function buildDedupeKey(doc) {
    // prefer stable IDs
    const stable = doc?.mongo_id || doc?._id;
    if (stable) return String(stable);

    // fallback (deterministic) for rare missing-id docs
    return `${doc?.productId || ''}__${doc?.product_name || ''}__${doc?.created_at || ''}__${doc?.quantity || ''}__${doc?.dosage_form || ''}`;
}

watch(
    inputdata,
    (newData) => {
        loading.value = true;

        const raw = unref(newData);

        // Turn whatever you have into "docs"
        const docs = normalizeInputToDocs(raw);

        // Debug: uncomment if needed
        // console.log('RAW store payload:', raw);
        // console.log('DOCS length:', docs.length);

        if (!docs.length) {
            purchases.value = [];
            totalRecords.value = 0;
            window.__FLAT_DATA__ = [];
            loading.value = false;
            return;
        }

        const colors = ['#f87171', '#60a5fa', '#4ade80', '#fbbf24', '#a78bfa'];

        const flatRows = [];
        const seen = new Set();

        for (let idx = 0; idx < docs.length; idx++) {
            const inv = docs[idx];

            const key = buildDedupeKey(inv);
            if (seen.has(key)) continue;
            seen.add(key);

            const isNew = previousKeys.value.size > 0 && !previousKeys.value.has(key);
            const isFilled = inv?.status === 'filled';

            flatRows.push({
                ...inv,
                id: key,

                // DO NOT explode inv.dates into multiple rows (that causes “duplicates”)
                created_at: inv?.created_at || 'N/A',

                // packaging mapping for table columns
                bottle_size: inv?.packaging?.bottle_size || '',
                bottle_color: inv?.packaging?.bottle_color || '',
                cap_color: inv?.packaging?.cap_color || '',
                cap_size: inv?.packaging?.cap_size || '',
                capsule_size: inv?.packaging?.capsule_size || '',

                // CSS hooks
                flashClass: isNew ? 'row-flash' : '',
                filledClass: isFilled ? 'row-filled' : '',
                rowStyle: isNew ? { '--flash-color': colors[idx % colors.length] } : {}
            });
        }

        previousKeys.value = seen;

        // keep one source of truth for search/export/paging
        window.__FLAT_DATA__ = flatRows;

        applyFiltersAndPaging(flatRows);
        loading.value = false;
    },
    { deep: true }
);

function applyFiltersAndPaging(data) {
    let filtered = [...data];

    const searchVal = lazyParams.value.filters.global.value;
    if (searchVal) {
        const term = String(searchVal).toLowerCase();
        filtered = filtered.filter((row) =>
            Object.values(row).some((val) =>
                String(val ?? '')
                    .toLowerCase()
                    .includes(term)
            )
        );
    }

    totalRecords.value = filtered.length;

    const start = lazyParams.value.page * lazyParams.value.rows;
    purchases.value = filtered.slice(start, start + lazyParams.value.rows);
}

const onFilter = () => {
    lazyParams.value.page = 0;
    applyFiltersAndPaging(window.__FLAT_DATA__ || []);
};

const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : 'N/A');
</script>

<template>
    <!--             :rowClass="(data) => [data.flashClass, data.filledClass]"
 -->
    <div class="card">
        <DataTable
            :value="purchases"
            :rowClass="getRowClass"
            :pt="{
                row: ({ context }) => ({
                    style: context.item?.rowStyle
                })
            }"
            :lazy="false"
            :paginator="true"
            :rows="lazyParams.rows"
            :totalRecords="totalRecords"
            :loading="loading"
            @page="
                (e) => {
                    lazyParams.page = e.page;
                    applyFiltersAndPaging(window.__FLAT_DATA__ || []);
                }
            "
            showGridlines
        >
            <template #header>
                <div class="flex justify-between gap-2">
                    <div class="flex gap-2">
                        <Button icon="pi pi-refresh" label="Refresh" @click="loadLazyData" />
                        <InputText v-model="lazyParams.filters.global.value" placeholder="Search..." @input="onFilter" />
                        <Button icon="pi pi-download" label="Export" @click="exportCSV" class="p-button-help" />
                        <!-- ALLEN ADDED BUTTON-->
                        <Button label="Status Page" icon="pi pi-arrow-right" @click="$router.push('/app/uikit/status-page')"></Button>
                    </div>
                </div>
            </template>

            <Column header="Filled" style="width: 3rem">
                <template #body="{ data }">
                    <Checkbox v-model="data.status" trueValue="filled" falseValue="pending" binary @change="toggleFilled(data)" />
                </template>
            </Column>

            <Column field="product_name" header="Product" />
            <Column field="created_at" header="Order Date">
                <template #body="{ data }">
                    {{ formatDate(data.created_at) }}
                </template>
            </Column>

            <Column field="dosage_form" header="Form" />
            <Column field="quantity" header="Qty" />

            <Column field="bottle_size" header="Bottle Size" />
            <Column field="bottle_color" header="Bottle Color" />
            <Column field="cap_color" header="Cap Color" />
            <Column field="cap_size" header="Cap Size" />
            <Column field="capsule_size" header="Capsule Size" />
        </DataTable>
    </div>
</template>

<style scoped>
:deep(.p-datatable-tbody > tr.row-filled) {
    position: relative !important;
}

:deep(.p-datatable-tbody > tr.row-filled::after) {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #ff0000;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 99;
}

:deep(.row-filled td) {
    color: #94a3b8 !important;
    opacity: 0.6;
}

@keyframes flash-animation {
    0% {
        background-color: transparent;
    }
    50% {
        background-color: var(--flash-color, #ffd700) !important;
    }
    100% {
        background-color: transparent;
    }
}

:deep(.row-flash) {
    animation: flash-animation 3s ease-in-out !important;
}
/* Quantity Colors */
:deep(.p-datatable-tbody > tr.row-large) {
    background-color: #dcfce7 !important; /* soft green */
}

:deep(.p-datatable-tbody > tr.row-medium) {
    background-color: #fef9c3 !important; /* soft yellow */
}

:deep(.p-datatable-tbody > tr.row-small) {
    background-color: #dbeafe !important; /* soft blue */
}

/* Recent indicator (left border) */
:deep(.p-datatable-tbody > tr.row-recent) {
    box-shadow: inset 4px 0 0 #ef4444;
}

/* Filled rows should visually win (override background colors) */
:deep(.p-datatable-tbody > tr.row-filled) {
    background-color: transparent !important;
}
</style>
