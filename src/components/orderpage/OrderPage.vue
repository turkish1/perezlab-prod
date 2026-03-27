<script setup>
import useProduct from '@/composables/getlogic/getprodpull';
import useOrderForm from '@/composables/postlogic/postOrderForm';
import { useProductStore } from '@/stores/useProductStore';
import Button from 'primevue/button';
import { computed, onBeforeMount, ref, watch } from 'vue';
// NOTE: make sure you imported Select globally or locally (PrimeVue v4 uses "Select")
const productStore = useProductStore();
const { fetchData, isFetching } = useProduct();

const products = computed(() => productStore.inputproduct ?? []);
const { postOrderForm } = useOrderForm();
const selectedProductId = ref(null);
const selectedProduct = computed(() => products.value.find((p) => p._id === selectedProductId.value) ?? null);

// Form Fields
const selectedCapsuleSize = ref(null);
const selectedBottleColor = ref(null);
const selectedBottleSize = ref(null);
const selectedBottleCapSize = ref(null);
const selectedBottleCapColor = ref(null);
const userEmail = ref('');
const selectedDosageForm = ref(null);
const qty = ref(1);
const qtyUnit = ref('bottles');

// ---- Your raw lists (primitives) ----
const capsuleSize = ref(['0', '00 REG', '0 CLEAR', '00 CLEAR', '0 PURPLE', '00 VEG', '0 VEG', '00 WHITE', '0 CLEAR', '0 BLUE/W VEGE', '00 BIOVXR', '0 CLEAR', '0 GELA', 'SOFTGEL']);
const bottleColor = ref(['White', 'White HDPE', 'White Pet', 'Clear', 'Clear Pet', 'Amber Pet', 'Amber Dark', 'Amber Dark Pet', 'Green Pet', 'Black Pet', 'Blue', 'Cobalt Blue']);
const bottleSize = ref([100, 120, 150, 180, 200, 225, 250, 300, 500, 750]);
const bottleCapsize = ref([38, 45, 225]);
const bottleCapColor = ref([
    'White',
    'White CRC',
    'White Ribbed W/Induction',
    'White Ribbed',
    'White W/Induction',
    'Black',
    'Black Matte',
    'White PS22',
    'Black Regular',
    'Black W/Induction',
    'Black W/Induction CRC',
    'Green W/Induction',
    'Gold CRC W/Induction',
    'Blue'
]);

// ---- Convert primitive arrays to Select-friendly {label,value} ----
const capsuleSizeOptions = computed(() => capsuleSize.value.map((v) => ({ label: v, value: v })));
const bottleColorOptions = computed(() => bottleColor.value.map((v) => ({ label: v, value: v })));
const bottleSizeOptions = computed(() => bottleSize.value.map((v) => ({ label: String(v), value: v })));
const bottleCapSizeOptions = computed(() => bottleCapsize.value.map((v) => ({ label: String(v), value: v })));
const bottleCapColorOptions = computed(() => bottleCapColor.value.map((v) => ({ label: v, value: v })));

// Dosage form options from selected product (yours was fine)

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

watch(
    () => selectedProductId.value,
    () => {
        selectedDosageForm.value = null;
        // auto-pick if only one option
        if (dosageFormOptions.value.length === 1) {
            selectedDosageForm.value = dosageFormOptions.value[0].value;
        }
    }
);
watch(selectedProduct, (newProd) => {
    if (!newProd) {
        resetForm();
        return;
    }

    // 1. Handle Dosage Form (e.g., "CAPSULE")
    if (newProd.dosage_form) {
        selectedDosageForm.value = Array.isArray(newProd.dosage_form) ? newProd.dosage_form[0] : newProd.dosage_form;
    }

    // 2. Handle Capsule Size (e.g., "\"0\" REG" -> "0 REG")

    if (newProd.capsule_size) {
        // 1. Remove all quotes: \"0\" REG -> 0 REG
        let cleanSize = newProd.capsule_size.replace(/[\"\\]/g, '').trim();

        // 2. Logic Check: If the store says "0 REG" but your list only has "0",
        // we might need to map it specifically.
        if (cleanSize === '0 REG') {
            selectedCapsuleSize.value = '0'; // Match your hardcoded '0'
        } else {
            selectedCapsuleSize.value = cleanSize;
        }
    }

    // 3. Handle Bottle Type (e.g., "150 WHITE")
    if (newProd.bottle_type) {
        const parts = newProd.bottle_type.split(' ');
        const sizeValue = parseInt(parts[0]);
        // The rest of the string (after the number) is the color
        const colorValue = parts.slice(1).join(' ').trim();

        if (!isNaN(sizeValue)) selectedBottleSize.value = sizeValue;
        if (colorValue) {
            // Standardize "WHITE" to "White" to match your hardcoded list if necessary
            selectedBottleColor.value = colorValue.charAt(0).toUpperCase() + colorValue.slice(1).toLowerCase();
        }
    }

    // 4. Handle Bottle Cap Size (e.g., "38 WHITE")
    if (newProd.bottle_cap_size) {
        const parts = newProd.bottle_cap_size.split(' ');
        const capSizeValue = parseInt(parts[0]);
        const capColorValue = parts.slice(1).join(' ').trim();

        if (!isNaN(capSizeValue)) selectedBottleCapSize.value = capSizeValue;
        if (capColorValue) {
            selectedBottleCapColor.value = capColorValue.charAt(0).toUpperCase() + capColorValue.slice(1).toLowerCase();
        }
    }
});

const capsulesPerBottle = computed(() => {
    const n = Number(selectedProduct.value?.package_size);
    return Number.isFinite(n) && n > 0 ? n : null;
});

const totalCapsules = computed(() => {
    const q = Number(qty.value) || 0;
    console.log(q);
    if (qtyUnit.value === 'capsules') return q;
    if (!capsulesPerBottle.value) return null; // bottles but unknown size
    return q * capsulesPerBottle.value;
});

// Reset dependent fields when product changes
watch(selectedProductId, () => {
    selectedDosageForm.value = null;
    qty.value = 1;
    qtyUnit.value = 'bottles';

    // optional: reset packaging picks too
    selectedCapsuleSize.value = null;
    selectedBottleColor.value = null;
    selectedBottleSize.value = null;
    selectedBottleCapSize.value = null;
    selectedBottleCapColor.value = null;
});

// Build payload
const orderLinePayload = computed(() => {
    const p = selectedProduct.value;
    console.log(p);
    // if (!p) return null;

    return {
        productId: p._id,
        email: userEmail.value.trim().toLowerCase(), // Added email
        product_name: p.product_name,
        dosage_form: selectedDosageForm.value,

        packaging: {
            capsule_size: selectedCapsuleSize.value,
            bottle_color: selectedBottleColor.value,
            bottle_size: selectedBottleSize.value,
            cap_size: selectedBottleCapSize.value,
            cap_color: selectedBottleCapColor.value
        },

        quantity: qty.value,
        quantity_unit: qtyUnit.value, // 'bottles' | 'capsules'
        capsules_per_bottle: capsulesPerBottle.value,
        total_capsules: totalCapsules.value,

        created_at: new Date().toISOString()
    };
});
const resetForm = () => {
    selectedDosageForm.value = null;
    selectedCapsuleSize.value = null;
    selectedBottleColor.value = null;
    selectedBottleSize.value = null;
    selectedBottleCapSize.value = null;
    selectedBottleCapColor.value = null;
    qty.value = 1;
    qtyUnit.value = 'bottles';
};
// Validation
const canSubmit = computed(() => {
    // If you want dosage_form required, keep this:
    // if (!selectedDosageForm.value) return false;
    const hasEmail = userEmail.value.length > 3 && userEmail.value.includes('@');
    if (!hasEmail || !qty.value || qty.value < 1) return false;
    return true;
    // if (!qty.value || qty.value < 1) return false;
    // return true;
});
watch(
    () => selectedProductId.value,
    () => {
        selectedDosageForm.value = null;
        if (dosageFormOptions.value.length === 1) {
            selectedDosageForm.value = dosageFormOptions.value[0].value;
        }
    }
);

const submitStatus = ref('');
const submitError = ref('');

const submitSelection = async () => {
    submitStatus.value = '';
    submitError.value = '';

    if (!canSubmit.value || !orderLinePayload.value) {
        submitError.value = 'Please select a product and quantity.';
        return;
    }

    try {
        await postOrderForm(orderLinePayload.value); // ✅ NOT the computed ref
        submitStatus.value = 'Order Sent!';
        userEmail.value = ''; // Reset email

        // reset
        selectedProductId.value = null;
        selectedDosageForm.value = null;
        qty.value = 1;
        qtyUnit.value = 'bottles';
    } catch (e) {
        submitError.value = e?.response?.data?.error || e?.response?.data?.details || e?.message || String(e);
    }
};
const loadingVideoSrc = '/loading.mp4';
onBeforeMount(async () => {
    await fetchData();
});
</script>

<template>
    <div>
        <h1>Products</h1>
        <!-- Loading Spinner -->
        <!-- <transition name="fade">
            <div v-if="isFetching" class="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="4" />
            </div>
        </transition> -->
        <transition name="fade">
            <div v-if="isFetching" class="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center rounded-lg overflow-hidden" style="z-index: 50">
                <video class="absolute inset-0 w-full h-full object-cover blur-md opacity-60" :src="loadingVideoSrc" autoplay muted loop playsinline preload="auto" />
                <!-- Optional: darken + add text on top -->
                <div class="absolute inset-0 bg-black/20"></div>
                <div class="absolute text-white font-semibold">Loading products…</div>
            </div>
        </transition>
        <div class="inner mx-auto max-w-5xl p-6 dark:bg-gray-800 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6" style="margin-left: 100px; border-radius: 5px">
            <!-- Product -->
            <div class="max-w-[200px] flex flex-col gap-2">
                <label style="color: #122620">Make a Selection</label>
                <Select v-model="selectedProductId" :options="products" optionLabel="product_name" optionValue="_id" placeholder="Select product" />
            </div>

            <!-- Dosage form -->
            <div class="w-64 flex flex-col gap-2">
                <Select v-model="selectedDosageForm" :options="dosageFormOptions" optionLabel="label" optionValue="value" placeholder="Dosage Options" class="w-full mt-5 md:w-56" />
            </div>
            <!-- Capsule size -->
            <div class="w-64 flex flex-col gap-2">
                <Select v-model="selectedCapsuleSize" :options="capsuleSizeOptions" optionLabel="label" optionValue="value" placeholder="Select Capsule Size" class="w-full mt-5 md:w-56" />
            </div>

            <!-- Cap color -->
            <div class="w-64 flex flex-col gap-2">
                <Select v-model="selectedBottleCapColor" :options="bottleCapColorOptions" optionLabel="label" optionValue="value" placeholder="Select Cap Color" class="w-full mt-5 md:w-56" />
            </div>

            <!-- Bottle size -->
            <div class="w-64 flex flex-col gap-2">
                <Select v-model="selectedBottleSize" :options="bottleSizeOptions" optionLabel="label" optionValue="value" placeholder="Select Bottle Size" class="w-full mt-5 md:w-56" />
            </div>

            <!-- Bottle color -->
            <div class="w-64 flex flex-col gap-2">
                <Select v-model="selectedBottleColor" :options="bottleColorOptions" optionLabel="label" optionValue="value" placeholder="Select Bottle Color" class="w-full mt-5 md:w-56" />
            </div>

            <!-- Cap size -->
            <div class="w-64 flex flex-col gap-2">
                <Select v-model="selectedBottleCapSize" :options="bottleCapSizeOptions" optionLabel="label" optionValue="value" placeholder="Select Cap Size" class="w-full mt-5 md:w-56" />
            </div>

            <div class="max-w-[280px] flex flex-col gap-2" style="margin-left: 10px">
                <label>Your Email (for confirmation)</label>
                <input type="email" v-model="userEmail" placeholder="Enter your email" style="width: 322px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; background-color: #f0f4f8" />
            </div>

            <div class="max-w-[280px] flex flex-col mb-4 mt-6 gap-3 space-y-2" style="margin-left: 10px">
                <label>Quantity</label>
                <div style="display: flex; gap: 12px; align-items: center">
                    <input type="number" min="1" v-model.number="qty" style="width: 150px; padding: 8px; border-radius: 4px; border: 1px solid #ccc; background-color: #f0f4f8" />

                    <Select
                        v-model="qtyUnit"
                        :options="[
                            { label: 'Bottles', value: 'bottles' },
                            { label: 'Capsules', value: 'capsules' }
                        ]"
                        optionLabel="label"
                        optionValue="value"
                        style="width: 160px"
                    />
                </div>
            </div>
            <!-- Summary -->
            <div class="p-mt-3" v-if="selectedProduct" style="margin-left: 10px">
                <div><b>Selected:</b> {{ selectedProduct.product_name }}</div>
                <div><b>Dosage form:</b> {{ selectedDosageForm || '—' }}</div>
                <div><b>Capsule size:</b> {{ selectedCapsuleSize || '—' }}</div>
                <div><b>Bottle size:</b> {{ selectedBottleSize || '—' }}</div>
                <div><b>Bottle color:</b> {{ selectedBottleColor || '—' }}</div>
                <div><b>Cap size:</b> {{ selectedBottleCapSize || '—' }}</div>
                <div><b>Cap color:</b> {{ selectedBottleCapColor || '—' }}</div>
                <div v-if="capsulesPerBottle"><b>Package size:</b> {{ capsulesPerBottle }} capsules/bottle</div>
                <div><b>Total capsules:</b> {{ totalCapsules }}</div>
            </div>

            <!-- Submit -->
            <div style="margin-left: 10px; margin-top: 16px">
                <Button :disabled="!canSubmit" label="Submit" severity="contrast" @click="submitSelection" style="padding: 10px 14px; border-radius: 8px" />

                <div v-if="submitStatus" style="margin-top: 8px">{{ submitStatus }}</div>
                <div v-if="submitError" style="margin-top: 8px; color: #b00020">{{ submitError }}</div>
            </div>
        </div>
    </div>
</template>
