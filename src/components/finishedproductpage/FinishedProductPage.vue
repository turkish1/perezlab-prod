<script setup>
import useFinProdForm from '@/composables/finishedProductLogic/FinishedProductData';
import useProduct from '@/composables/getlogic/getprodpull';
import useTabledata from '@/composables/getlogic/getTabledata';
import getUpdateInventory from '@/composables/postlogic/postInventoryData';
import { useProductStore } from '@/stores/useProductStore';
import { useTableStore } from '@/stores/useTableStore';
import { useToast } from 'primevue/usetoast';

import MultiSelect from 'primevue/multiselect';

import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
// NOTE: make sure you imported Select globally or locally (PrimeVue v4 uses "Select")
const productStore = useProductStore();
const { fetchData, isFetching } = useProduct();
const { getTabledataFunc } = useTabledata();
const products = computed(() => productStore.inputproduct ?? []);
const { postFinProdForm } = useFinProdForm();
const item = ref({});
const ACTION = ref('');

const selectedProductId = ref(null);
const selectedProduct = computed(() => products.value.find((p) => p._id === selectedProductId.value) ?? null);
const toast = useToast();
const { postUpdateInventory } = getUpdateInventory();

// Pinia store
const tableStore = useTableStore();
const tableInventory = computed(() => tableStore.inputdatatable ?? []);

// Form Fields
const selectedProductName = ref(null);
const selectedRMnumb = ref(null);
const selectedLotNumb = ref(null);
const inputAmountKG = ref(null);
const selectedClientName = ref(null);
const selectedCapsPerK = ref(null);
const selectedStaffName = ref(null);
const inputMixes = ref(1);
const selectedRM = ref([]);

// ---- Your raw lists (primitives) ----

const inventory = ref([]);

const ClientNames = ref(['ALL CONSULTING GROUP', 'BLUE ORGANIX LLC', 'GERARDO BARILLA', 'GERMA PRODUCT', 'GOLD CROWN', 'MARCELINO SUAREZ', 'NELCIA', 'RAINFOREST', 'SABIO THERAPEUTICS']);
const productType = ref(['Capsules', 'Tablets']);
const RMName = ref([]);
// ---- Convert primitive arrays to Select-friendly {label,value} ----
const ClientNamesOptions = computed(() => ClientNames.value.map((v) => ({ label: v, value: v })));

// Dosage form options from selected product (yours was fine)
onMounted(async () => {
    await fetchInventory();
});
const fetchInventory = async () => {
    try {
        await getTabledataFunc();
        inventory.value = tableInventory.value;
        // 2. Map inventory to RMName structure
        // Assuming inventory items have 'item_name' and 'item_id' or similar fields
        RMName.value = inventory.value.map((item) => ({
            rm: item.RM || '',
            name: item.DESCRIPTION || 'Unknown Item', // Adjust key based on your API
            code: item.RM || item._id,
            weight: 0 // Initialize weight at 0 for the user to fill in
        }));
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to load inventory', life: 3000 });
    }
};
const dosageFormOptions = computed(() => {
    const p = selectedProduct.value;
    if (!p) return [];

    const raw = p.dosage_form;

    const list = typeof raw === 'string' ? [raw] : Array.isArray(raw) ? raw : [];

    return list
        .map((v) => String(v).trim())
        .filter((v) => v.length > 0)
        .map((v) => ({ label: v, value: v }));
});

const saveItem = async () => {
    // 1. Basic Validation
    if (!selectedProductId.value || selectedRM.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Missing Info', detail: 'Please select a product and at least one Raw Material.', life: 3000 });
        return;
    }

    submitStatus.value = 'Processing batch...';
    submitError.value = '';
    console.log(selectedRM.value);
    try {
        // 2. Loop through each selected Raw Material to remove stock
        // We use Promise.all to send these requests in parallel
        const inventoryPromises = selectedRM.value.map((rmItem) => {
            const inventoryPayload = {
                ACTION: 'remove_stock',
                RM: rmItem.rm,
                Amount: Number(rmItem.weight * inputMixes) || 0,
                DESCRIPTION: rmItem.name,
                name: 'Batch Process System', // or user's name
                DATE: new Date().toLocaleDateString()
            };
            return postUpdateInventory(inventoryPayload);
        });

        await Promise.all(inventoryPromises);

        // 4. Success handling
        toast.add({ severity: 'success', summary: 'Success', detail: 'Inventory updated and Batch recorded.', life: 3000 });

        // Refresh local inventory data
        await fetchInventory();
        resetForm();
        selectedRM.value = []; // Clear selection
        submitStatus.value = 'Batch completed successfully.';
    } catch (err) {
        console.error('Submission Error:', err);
        submitError.value = 'Failed to process batch. Please check console for details.';
        toast.add({ severity: 'error', summary: 'Error', detail: 'Processing failed.', life: 3000 });
    }
};

watch(
    () => selectedProductId.value,
    () => {
        selectedStaffName.value = null;
        // auto-pick if only one option
        if (dosageFormOptions.value.length === 1) {
            selectedStaffName.value = dosageFormOptions.value[0].value;
        }
    }
);

// Reset dependent fields when product changes
watch(selectedProductId, () => {
    selectedStaffName.value = null;
    inputMixes.value = 1;

    // optional: reset packaging picks too
    selectedProductName.value = null;
    selectedRMnumb.value = null;
    selectedLotNumb.value = null;
    inputAmountKG.value = null;
    selectedClientName.value = null;
});
// Watch the selectedRM array deeply to catch changes in the 'weight' property
watch(
    selectedRM,
    (newSelection) => {
        // sum up the weight of all items currently in the selectedRM array
        const total = newSelection.reduce((sum, item) => {
            return sum + (Number(item.weight) || 0);
        }, 0);

        // Update your inputAmountKG ref with the result
        // Using .toFixed(2) if you want to keep it to 2 decimal places as a string
        inputAmountKG.value = total > 0 ? total.toFixed(2) : null;
    },
    { deep: true }
);

const resetForm = () => {
    selectedProductId.value = null;
    selectedStaffName.value = null;
    selectedProductName.value = null;
    selectedRMnumb.value = null;
    selectedLotNumb.value = null;
    inputAmountKG.value = null;
    selectedClientName.value = null;
    inputMixes.value = 1;
};

const submitStatus = ref('');
const submitError = ref('');

const loadingVideoSrc = '/loading.mp4';
onBeforeMount(async () => {
    await fetchData();
});
</script>
<template>
    <div class="p-4 md:p-10">
        <h1 class="text-2xl font-bold mb-6 text-slate-800">Batch Process</h1>

        <transition name="fade">
            <div v-if="isFetching" class="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
                <video class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" :src="loadingVideoSrc" autoplay muted loop playsinline preload="auto" disablePictureInPicture />
                <div class="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/50"></div>
                <div class="text-slate-800 font-black tracking-tighter text-xl drop-shadow-md animate-pulse">SYNCING INVENTORY...</div>
            </div>
        </transition>

        <div class="mx-auto max-w-5xl p-8 bg-white/40 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700">Select Product</label>
                <Select v-model="selectedProductId" :options="products" optionLabel="product_name" optionValue="_id" placeholder="Select product" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700">Number of Mixes</label>
                <InputText v-model="selectedProductName" placeholder="Number of Mixes" v-model.number="inputMixes" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700">Client</label>
                <Select v-model="selectedClientName" :options="ClientNamesOptions" optionLabel="label" optionValue="value" placeholder="Select Client" class="w-full" />
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700">Lot Number</label>
                <InputText v-model="selectedLotNumb" placeholder="Lot #" class="w-full" />
            </div>

            <div class="flex flex-col gap-2 md:col-span-1">
                <label class="font-semibold text-slate-700">Raw Materials</label>
                <MultiSelect v-model="selectedRM" display="chip" :options="RMName" optionLabel="name" filter placeholder="Select RM Name" class="w-full">
                    <template #option="slotProps">
                        <div class="flex items-center justify-between w-full gap-2 py-1">
                            <span>{{ slotProps.option.rm }} : {{ slotProps.option.name }}</span>
                            <div v-if="slotProps.selected" class="flex items-center gap-2">
                                <InputNumber v-model="slotProps.option.weight" :minFractionDigits="2" class="w-24" @click.stop />
                                <span class="text-xs">kg</span>
                            </div>
                        </div>
                    </template>
                    <template #chip="slotProps">
                        <div class="flex items-center gap-2 px-2">
                            <span class="font-bold">{{ slotProps.value.rm }}: {{ slotProps.value.name }}</span>
                            <span v-if="slotProps.value.weight" class="text-blue-600"> ({{ slotProps.value.weight }} kg) </span>
                        </div>
                    </template>
                </MultiSelect>
                <label class="text-sm font-bold mt-1">Total Weight: {{ (inputAmountKG * inputMixes) }} kg</label>
            </div>

            <div class="flex flex-col gap-2">
                <label class="font-semibold text-slate-700"># of Units (Millions)</label>
                <div class="flex gap-3">
                    <input type="number" min="1" v-model.number="selectedCapsPerK" class="w-1/2 p-2 rounded border border-slate-300 bg-slate-50/50" />
                    <Select
                        v-model="productType"
                        :options="[
                            { label: 'Tablets', value: 'tablets' },
                            { label: 'Capsules', value: 'capsules' }
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        class="w-1/2"
                    />
                </div>
            </div>

            <div v-if="selectedProduct" class="md:col-span-2 mt-4 p-6 bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm">
                <div class="flex items-center gap-3 mb-4">
                    <span class="bg-slate-800 text-white font-semibold rounded-md px-3 py-1 text-xs uppercase tracking-wider">Summary</span>
                    <div class="h-px flex-1 bg-slate-200"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div class="flex justify-between py-1 border-b border-slate-100">
                        <span class="text-sm text-slate-500 italic">Product:</span>
                        <span class="text-sm font-bold text-slate-800">{{ selectedProduct.product_name }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-slate-100">
                        <span class="text-sm text-slate-500 italic">Mixes:</span>
                        <span class="text-sm font-semibold">{{ selectedProductName || '—' }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-slate-100">
                        <span class="text-sm text-slate-500 italic">Lot:</span>
                        <span class="text-sm font-mono">{{ selectedLotNumb || '—' }}</span>
                    </div>

                    <div class="flex justify-between py-1 border-b border-slate-100">
                        <span class="text-sm font-medium text-slate-500 italic">Client Name:</span>
                        <span class="text-sm font-semibold text-slate-700 text-right">{{ selectedClientName || '—' }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-indigo-100 bg-indigo-50/50 px-1">
                        <span class="text-sm font-bold text-indigo-600 italic">Total Amount:</span>
                        <span class="text-sm font-black text-indigo-700">{{ (inputAmountKG * inputMixes) || '0' }} kg</span>
                    </div>
                </div>
            </div>

            <div class="md:col-span-2 flex flex-col items-end mt-4">
                <Button label="Submit Batch" icon="pi pi-check" @click="saveItem" class="p-button-lg" />
                <div v-if="submitStatus" class="mt-2 text-sm text-green-600">{{ submitStatus }}</div>
                <div v-if="submitError" class="mt-2 text-sm text-red-600">{{ submitError }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* // 1. Force the container to a column layout */
:deep(.p-multiselect-label) {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px; /* Space between vertical items */
    padding: 10px !important;
    height: auto !important; /* Allows it to grow vertically  */
    min-height: 44px;
}

/* 2. Make each chip take up the full width  */
:deep(.p-multiselect-token) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0 !important; /* Remove default chip margins */
}

/* 3. Ensure the main component itself can grow */
.w-full {
    height: auto !important;
}
/* Custom utility for the Glass Inputs */
.glass-input {
    background: rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 12px !important;
    transition: all 0.3s ease;
}

.glass-input:hover {
    background: rgba(255, 255, 255, 0.3) !important;
}

/* Make sure the text is readable over the background */
label {
    color: #1e293b; /* slate-800 */
    font-weight: 600;
    letter-spacing: 0.025em;
}

/* Modernize the page background to see the blur effect */
:deep(body) {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    min-height: 100vh;
}
.inner {
    width: 100%;
    height: 75%;
}
</style>
