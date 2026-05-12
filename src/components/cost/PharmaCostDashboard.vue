<script setup>
import { loadQuote, saveQuote, simulateQuote } from '@/composables/Cost/costApi.js';
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import { computed, reactive } from 'vue';

const state = reactive({
    product: {
        company: '',
        name: '',
        quote: '',
        date: new Date().toLocaleDateString('en-US')
    },

    batch: {
        quantityCapsules: 100000,
        capsulesPerBottle: 90,
        quantityBottles: 1111.11,
        theoreticalWeightKg: 51.15
    },

    packagingCosts: {
        bottle: 0,
        cap: 0,
        neckBand: 0,
        label: 0,
        cotton: 0,
        silica: 0,
        innerBox: 0,
        masterBox: 0
    },

    fees: {
        encapsulation: 0,
        overhead: 0,
        packagingLabor: 0,
        labFee: 0,

        qcTesting: 5000,
        qaLabor: 2000,
        facilityOverhead: 8000,
        stabilityTesting: 3000,
        regulatoryAmortization: 2000,
        depreciation: 4000
    },

    pricing: {
        bulkSelling: 0,
        bottleSelling: 0,
        originalBottleCost: 0,
        targetMarginPercent: 30 // This is now user-editable
    },

    materials: [
        {
            name: '',
            type: 'active',
            mgUnit: 0,
            totalKg: 0,
            priceKg: 0,
            totalPrice: 0,
            weightPercent: 0
        }
    ],

    pharmaAssumptions: {
        yield: {
            mean: 95,
            min: 92,
            max: 98,
            stdDev: 1.5
        },
        batchFailureRatePercent: 2
    },

    pharmaResults: {
        averageCostPerBottle: 0,
        bestCaseCostPerBottle: 0,
        worstCaseCostPerBottle: 0,
        p10CostPerBottle: 0,
        p90CostPerBottle: 0,
        estimatedMarginPercent: 0
    },

    facts: {
        servingSize: '',
        servingsPer: '',
        items: [
            {
                name: '',
                amount: '',
                dv: ''
            }
        ],
        otherIngredients: ''
    },

    lastUpdated: ''
});

const loading = reactive({
    save: false,
    load: false,
    simulation: false
});

const totalMaterialCost = computed(() => {
    return state.materials.reduce((sum, item) => {
        return sum + Number(item.totalPrice || 0);
    }, 0);
});

const totalKg = computed(() => {
    return state.materials.reduce((sum, item) => {
        return sum + Number(item.totalKg || 0);
    }, 0);
});

const packagingCostPerBottle = computed(() => {
    return (
        Number(state.packagingCosts.bottle || 0) +
        Number(state.packagingCosts.cap || 0) +
        Number(state.packagingCosts.neckBand || 0) +
        Number(state.packagingCosts.label || 0) +
        Number(state.packagingCosts.cotton || 0) +
        Number(state.packagingCosts.silica || 0) +
        Number(state.packagingCosts.innerBox || 0) +
        Number(state.packagingCosts.masterBox || 0)
    );
});

const feeCostPerBottle = computed(() => {
    return Number(state.fees.encapsulation || 0) + Number(state.fees.overhead || 0) + Number(state.fees.packagingLabor || 0) + Number(state.fees.labFee || 0);
});

const originalBottleCost = computed(() => {
    return packagingCostPerBottle.value + feeCostPerBottle.value;
});

const bottleSellingPrice = computed(() => {
    // Logic updated to calculate price based on the target margin input
    const marginDecimal = Number(state.pricing.targetMarginPercent || 0) / 100;
    return originalBottleCost.value * (1 + marginDecimal); 
});

const pharmaMarginPercent = computed(() => {
    const price = Number(state.pricing.bottleSelling || bottleSellingPrice.value || 0);
    const cost = Number(state.pharmaResults.averageCostPerBottle || 0);

    if (!price || !cost) return 0;

    return ((price - cost) / price) * 100;
});

function refreshPricing() {
    state.pricing.originalBottleCost = Number(originalBottleCost.value.toFixed(2));
    state.pricing.bottleSelling = Number(bottleSellingPrice.value.toFixed(2));
}

async function saveToAWS() {
    if (!state.product.quote) {
        alert('Quote ID required');
        return;
    }

    loading.save = true;

    try {
        refreshPricing();

        const data = await saveQuote(state);

        if (data) {
            Object.assign(state, data);
        }

        alert('Quote Saved');
    } catch (e) {
        console.error(e);
        alert('Save Failed');
    } finally {
        loading.save = false;
    }
}

async function loadFromAWS() {
    const id = prompt('Quote ID:');

    if (!id) return;

    loading.load = true;

    try {
        const data = await loadQuote(id);

        if (data) {
            Object.assign(state, data);
        } else {
            alert('Not Found');
        }
    } catch (e) {
        console.error(e);
        alert('Load Failed');
    } finally {
        loading.load = false;
    }
}

async function runPharmaSimulation() {
    if (!state.product.quote) {
        alert('Quote ID required');
        return;
    }

    loading.simulation = true;

    try {
        refreshPricing();

        const result = await simulateQuote(state);

        if (result.pharmaResults) {
            state.pharmaResults = result.pharmaResults;
        } else {
            state.pharmaResults = result;
        }

        alert('Simulation Complete');
    } catch (e) {
        console.error(e);
        alert('Simulation Failed');
    } finally {
        loading.simulation = false;
    }
}

function addMaterial() {
    state.materials.push({
        name: '',
        type: 'excipient',
        mgUnit: 0,
        totalKg: 0,
        priceKg: 0,
        totalPrice: 0,
        weightPercent: 0
    });
}

function removeMaterial(index) {
    state.materials.splice(index, 1);
}

function addFactRow() {
    state.facts.items.push({
        name: '',
        amount: '',
        dv: ''
    });
}

function removeFactRow(index) {
    state.facts.items.splice(index, 1);
}
</script>

<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <div class="max-w-7xl mx-auto space-y-6">
            <header class="bg-white rounded-2xl shadow p-6 border-l-8 border-blue-700">
                <h1 class="text-3xl font-bold">Pharma-Grade Cost Dashboard</h1>
                <p class="text-gray-500">MongoDB document powered by AWS Lambda Function URL.</p>
            </header>

            <section class="bg-white rounded-2xl shadow p-4 flex gap-3">
                <button @click="loadFromAWS" class="bg-gray-700 text-white px-4 py-2 rounded-lg">
                    {{ loading.load ? 'Loading...' : 'Load' }}
                </button>

                <button @click="saveToAWS" class="bg-green-700 text-white px-4 py-2 rounded-lg">
                    {{ loading.save ? 'Saving...' : 'Save' }}
                </button>

                <button @click="runPharmaSimulation" class="bg-blue-700 text-white px-4 py-2 rounded-lg">
                    {{ loading.simulation ? 'Running...' : 'Run Simulation' }}
                </button>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">Original Cost / Bottle</p>
                    <h2 class="text-2xl font-bold">${{ state.pricing.originalBottleCost.toFixed(2) }}</h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">Calculated Selling Price</p>
                    <h2 class="text-2xl font-bold">${{ bottleSellingPrice.toFixed(2) }}</h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">Avg Pharma Cost</p>
                    <h2 class="text-2xl font-bold">${{ Number(state.pharmaResults.averageCostPerBottle || 0).toFixed(2) }}</h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">Pharma Margin</p>
                    <h2 class="text-2xl font-bold">{{ pharmaMarginPercent.toFixed(1) }}%</h2>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">Pricing Strategy</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatLabel>
                        <InputNumber v-model="state.pricing.targetMarginPercent" inputId="target-margin" class="w-full" inputClass="w-full" suffix="%" />
                        <label for="target-margin">Target Margin %</label>
                    </FloatLabel>
                    <div class="flex items-center text-gray-600 italic">
                        Adjusting the margin will automatically update the Calculated Selling Price above.
                    </div>
                </div>
            </section>

            <section class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">Best Case</p>
                    <h2 class="text-xl font-bold">${{ Number(state.pharmaResults.bestCaseCostPerBottle || 0).toFixed(2) }}</h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">Worst Case</p>
                    <h2 class="text-xl font-bold">${{ Number(state.pharmaResults.worstCaseCostPerBottle || 0).toFixed(2) }}</h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">P10 Cost</p>
                    <h2 class="text-xl font-bold">${{ Number(state.pharmaResults.p10CostPerBottle || 0).toFixed(2) }}</h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">P90 Risk Cost</p>
                    <h2 class="text-xl font-bold">${{ Number(state.pharmaResults.p90CostPerBottle || 0).toFixed(2) }}</h2>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">Product</h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatLabel>
                        <InputText id="product-company" v-model="state.product.company" class="w-full" />
                        <label for="product-company">Company</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="product-name" v-model="state.product.name" class="w-full" />
                        <label for="product-name">Product Name</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="product-quote" v-model="state.product.quote" class="w-full" />
                        <label for="product-quote">Quote</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="product-date" v-model="state.product.date" class="w-full" />
                        <label for="product-date">Date</label>
                    </FloatLabel>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">Batch</h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatLabel>
                        <InputNumber v-model="state.batch.quantityCapsules" inputId="batch-quantity-capsules" class="w-full" inputClass="w-full" />
                        <label for="batch-quantity-capsules">Quantity Capsules</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.batch.capsulesPerBottle" inputId="batch-capsules-per-bottle" class="w-full" inputClass="w-full" />
                        <label for="batch-capsules-per-bottle">Capsules / Bottle</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.batch.quantityBottles" inputId="batch-quantity-bottles" class="w-full" inputClass="w-full" />
                        <label for="batch-quantity-bottles">Quantity Bottles</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.batch.theoreticalWeightKg" inputId="batch-theoretical-kg" class="w-full" inputClass="w-full" />
                        <label for="batch-theoretical-kg">Theoretical Kg</label>
                    </FloatLabel>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">Packaging Costs</h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.bottle" inputId="packaging-bottle" class="w-full" inputClass="w-full" />
                        <label for="packaging-bottle">Bottle</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.cap" inputId="packaging-cap" class="w-full" inputClass="w-full" />
                        <label for="packaging-cap">Cap</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.neckBand" inputId="packaging-neck-band" class="w-full" inputClass="w-full" />
                        <label for="packaging-neck-band">Neck Band</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.label" inputId="packaging-label" class="w-full" inputClass="w-full" />
                        <label for="packaging-label">Label</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.cotton" inputId="packaging-cotton" class="w-full" inputClass="w-full" />
                        <label for="packaging-cotton">Cotton</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.silica" inputId="packaging-silica" class="w-full" inputClass="w-full" />
                        <label for="packaging-silica">Silica</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.innerBox" inputId="packaging-inner-box" class="w-full" inputClass="w-full" />
                        <label for="packaging-inner-box">Inner Box</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.packagingCosts.masterBox" inputId="packaging-master-box" class="w-full" inputClass="w-full" />
                        <label for="packaging-master-box">Master Box</label>
                    </FloatLabel>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">Fees</h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FloatLabel>
                        <InputNumber v-model="state.fees.encapsulation" inputId="fee-encapsulation" class="w-full" inputClass="w-full" />
                        <label for="fee-encapsulation">Encapsulation</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.overhead" inputId="fee-overhead" class="w-full" inputClass="w-full" />
                        <label for="fee-overhead">Overhead</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.packagingLabor" inputId="fee-packaging-labor" class="w-full" inputClass="w-full" />
                        <label for="fee-packaging-labor">Packaging Labor</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.labFee" inputId="fee-lab-fee" class="w-full" inputClass="w-full" />
                        <label for="fee-lab-fee">Lab Fee</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.qcTesting" inputId="fee-qc-testing" class="w-full" inputClass="w-full" />
                        <label for="fee-qc-testing">QC Testing</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.qaLabor" inputId="fee-qa-labor" class="w-full" inputClass="w-full" />
                        <label for="fee-qa-labor">QA Labor</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.facilityOverhead" inputId="fee-facility-overhead" class="w-full" inputClass="w-full" />
                        <label for="fee-facility-overhead">Facility Overhead</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.stabilityTesting" inputId="fee-stability-testing" class="w-full" inputClass="w-full" />
                        <label for="fee-stability-testing">Stability Testing</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.regulatoryAmortization" inputId="fee-regulatory-amortization" class="w-full" inputClass="w-full" />
                        <label for="fee-regulatory-amortization">Regulatory Amortization</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.fees.depreciation" inputId="fee-depreciation" class="w-full" inputClass="w-full" />
                        <label for="fee-depreciation">Depreciation</label>
                    </FloatLabel>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Materials</h2>
                    <button @click="addMaterial" class="bg-blue-700 text-white px-3 py-2 rounded-lg">Add Material</button>
                </div>

                <table class="w-full text-sm border-collapse">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="border p-2 text-left">Name</th>
                            <th class="border p-2 text-left">Type</th>
                            <th class="border p-2 text-right">Mg Unit</th>
                            <th class="border p-2 text-right">Total Kg</th>
                            <th class="border p-2 text-right">Price / Kg</th>
                            <th class="border p-2 text-right">Total Price</th>
                            <th class="border p-2 text-right">Weight %</th>
                            <th class="border p-2"></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(material, index) in state.materials" :key="index">
                            <td class="border p-2">
                                <InputText v-model="material.name" class="w-full" />
                            </td>

                            <td class="border p-2">
                                <InputText v-model="material.type" class="w-full" />
                            </td>

                            <td class="border p-2">
                                <InputNumber v-model="material.mgUnit" class="w-full" inputClass="w-full text-right" />
                            </td>

                            <td class="border p-2">
                                <InputNumber v-model="material.totalKg" class="w-full" inputClass="w-full text-right" />
                            </td>

                            <td class="border p-2">
                                <InputNumber v-model="material.priceKg" class="w-full" inputClass="w-full text-right" />
                            </td>

                            <td class="border p-2">
                                <InputNumber v-model="material.totalPrice" class="w-full" inputClass="w-full text-right" />
                            </td>

                            <td class="border p-2">
                                <InputNumber v-model="material.weightPercent" class="w-full" inputClass="w-full text-right" />
                            </td>

                            <td class="border p-2 text-center">
                                <button @click="removeMaterial(index)" class="bg-red-700 text-white px-2 py-1 rounded">X</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-100 rounded p-3">Total Kg: {{ totalKg.toFixed(3) }}</div>
                    <div class="bg-gray-100 rounded p-3">Total Material Cost: ${{ totalMaterialCost.toFixed(2) }}</div>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">Pharma Assumptions</h2>

                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <FloatLabel>
                        <InputNumber v-model="state.pharmaAssumptions.yield.mean" inputId="yield-mean" class="w-full" inputClass="w-full" />
                        <label for="yield-mean">Yield Mean</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.pharmaAssumptions.yield.min" inputId="yield-min" class="w-full" inputClass="w-full" />
                        <label for="yield-min">Yield Min</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.pharmaAssumptions.yield.max" inputId="yield-max" class="w-full" inputClass="w-full" />
                        <label for="yield-max">Yield Max</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.pharmaAssumptions.yield.stdDev" inputId="yield-std-dev" class="w-full" inputClass="w-full" />
                        <label for="yield-std-dev">Std Dev</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber v-model="state.pharmaAssumptions.batchFailureRatePercent" inputId="batch-failure-rate-percent" class="w-full" inputClass="w-full" />
                        <label for="batch-failure-rate-percent">Failure Rate %</label>
                    </FloatLabel>
                </div>
            </section>

            <section class="bg-white rounded-2xl shadow p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Supplement Facts</h2>
                    <button @click="addFactRow" class="bg-blue-700 text-white px-3 py-2 rounded-lg">Add Fact</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <FloatLabel>
                        <InputText id="facts-serving-size" v-model="state.facts.servingSize" class="w-full" />
                        <label for="facts-serving-size">Serving Size</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="facts-servings-per" v-model="state.facts.servingsPer" class="w-full" />
                        <label for="facts-servings-per">Servings Per</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="facts-other-ingredients" v-model="state.facts.otherIngredients" class="w-full" />
                        <label for="facts-other-ingredients">Other Ingredients</label>
                    </FloatLabel>
                </div>

                <table class="w-full text-sm border-collapse">
                    <thead>
                        <tr class="bg-gray-200">
                            <th class="border p-2 text-left">Name</th>
                            <th class="border p-2 text-left">Amount</th>
                            <th class="border p-2 text-left">DV</th>
                            <th class="border p-2"></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="(item, index) in state.facts.items" :key="index">
                            <td class="border p-2">
                                <InputText v-model="item.name" class="w-full" />
                            </td>

                            <td class="border p-2">
                                <InputText v-model="item.amount" class="w-full" />
                            </td>

                            <td class="border p-2">
                                <InputText v-model="item.dv" class="w-full" />
                            </td>

                            <td class="border p-2 text-center">
                                <button @click="removeFactRow(index)" class="bg-red-700 text-white px-2 py-1 rounded">X</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    </div>
</template>

<style scoped>
/* Ensure FloatLabel blocks behave properly */
:deep(.p-float-label) {
    display: block;
    width: 100%;
    margin-top: 8px; /* spacing above each field */
    margin-bottom: 12px; /* spacing below each field */
}

/* Make sure PrimeVue inputs fill container */
:deep(.p-inputtext),
:deep(.p-inputnumber),
:deep(.p-inputnumber-input) {
    width: 100%;
}

/* Improve vertical spacing inside grids */
.grid {
    row-gap: 18px !important;
}

/* Slightly lift default label position */
:deep(.p-float-label label) {
    transform: translateY(-0.5rem);
    transition: all 0.15s ease;
}

/* When active, float label higher to avoid overlap */
:deep(.p-float-label input:focus ~ label),
:deep(.p-float-label .p-inputwrapper-focus ~ label),
:deep(.p-float-label input.p-filled ~ label),
:deep(.p-float-label .p-inputwrapper-filled ~ label) {
    transform: translateY(-1.2rem) scale(0.85);
}

/* Optional: tighten table inputs */
.table-input {
    width: 100%;
    border: 1px solid transparent;
    padding: 6px;
    background: transparent;
    border-radius: 8px;
    box-sizing: border-box;
}

/* Delete button styling (kept same look) */
.delete-btn {
    border: none;
    background: #fee2e2;
    color: #b91c1c;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    line-height: 1;
}

.delete-btn:hover {
    background: #fecaca;
}
</style>