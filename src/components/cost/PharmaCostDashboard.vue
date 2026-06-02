<script setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import Checkbox from 'primevue/checkbox';
import FloatLabel from 'primevue/floatlabel';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

import { useCostStore } from '@/stores/costStore';

const costStore = useCostStore();

const {
    state,
    loading,
    productOptions,

    originalBottleCost,

    totalMaterialCost,
    totalKg,
    bottleSellingPrice,
    pharmaMarginPercent
} = storeToRefs(costStore);

const {
    fetchProducts,
    load,
    save,
    simulate,

    addMaterial,
    removeMaterial,
    addFactRow,
    removeFactRow
} = costStore;

onMounted(() => {
    fetchProducts();
});
</script>

<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- HEADER -->
            <header
                class="bg-white rounded-2xl shadow p-6 border-l-8 border-blue-700"
            >
                <h1 class="text-3xl font-bold">
                    Pharma-Grade Cost Dashboard
                </h1>

                <p class="text-gray-500">
                    MongoDB document powered by AWS Lambda Function URL.
                </p>
            </header>

            <!-- PRODUCT -->
            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">
                    Product
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <FloatLabel>
                        <InputText
                            id="product-company"
                            v-model="state.product.company"
                            class="w-full"
                        />

                        <label for="product-company">
                            Company
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <Select
                            id="product-name"
                            v-model="state.product.name"
                            :options="productOptions.items"
                            optionLabel="label"
                            optionValue="value"
                            filter
                            showClear
                            class="w-full"
                        />

                        <label for="product-name">
                            Product Name
                        </label>
                    </FloatLabel>

                <!-- ACTIONS -->
                <button
                    @click="load"
                    class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                >
                    {{ loading.load ? 'Loading...' : 'Load' }}
                </button>

                <button
                    @click="save"
                    class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition"
                >
                    {{ loading.save ? 'Saving...' : 'Save' }}
                </button>

                <button
                    @click="simulate"
                    class="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
                >
                    {{
                        loading.simulation
                            ? 'Running...'
                            : 'Run Simulation'
                    }}
                </button>

                </div>
            </section>

            <!-- KPI CARDS -->
            <section class="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        Original Cost / Bottle
                    </p>

                    <h2 class="text-2xl font-bold">
                        <!-- ${{ Number(state.pricing.originalBottleCost || 0).toFixed(2) }} -->
                        ${{Number(originalBottleCost || 0).toFixed(2) }}
                    </h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        Calculated Selling Price
                    </p>

                    <h2 class="text-2xl font-bold">
                        ${{ Number(bottleSellingPrice || 0).toFixed(2) }}
                    </h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        Avg Pharma Cost
                    </p>

                    <h2 class="text-2xl font-bold">
                        ${{
                            Number(
                                state.pharmaResults.averageCostPerBottle || 0
                            ).toFixed(2)
                        }}
                    </h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        Pharma Margin
                    </p>

                    <h2 class="text-2xl font-bold">
                        {{ Number(pharmaMarginPercent || 0).toFixed(1) }}%
                    </h2>
                </div>

            </section>

            <!-- PRICING -->
            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">
                    Pricing Strategy
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FloatLabel>
                        <InputNumber
                            v-model="state.pricing.targetMarginPercent"
                            inputId="target-margin"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                            suffix="%"
                        />

                        <label for="target-margin">
                            Target Margin %
                        </label>
                    </FloatLabel>

                    <div
                        class="flex items-center text-gray-600 italic"
                    >
                        Adjusting the margin will automatically
                        update the Calculated Selling Price above.
                    </div>

                </div>
            </section>

            <!-- SIMULATION -->
            <section class="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        Best Case
                    </p>

                    <h2 class="text-xl font-bold">
                        ${{
                            Number(
                                state.pharmaResults.bestCaseCostPerBottle || 0
                            ).toFixed(2)
                        }}
                    </h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        Worst Case
                    </p>

                    <h2 class="text-xl font-bold">
                        ${{
                            Number(
                                state.pharmaResults.worstCaseCostPerBottle || 0
                            ).toFixed(2)
                        }}
                    </h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        P10 Cost
                    </p>

                    <h2 class="text-xl font-bold">
                        ${{
                            Number(
                                state.pharmaResults.p10CostPerBottle || 0
                            ).toFixed(2)
                        }}
                    </h2>
                </div>

                <div class="bg-white rounded-xl shadow p-5">
                    <p class="text-sm text-gray-500">
                        P90 Risk Cost
                    </p>

                    <h2 class="text-xl font-bold">
                        ${{
                            Number(
                                state.pharmaResults.p90CostPerBottle || 0
                            ).toFixed(2)
                        }}
                    </h2>
                </div>

            </section>

            <!-- BATCH -->
            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">
                    Batch
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <FloatLabel>
                        <InputNumber
                            v-model="state.batch.quantityCapsules"
                            inputId="batch-quantity-capsules"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="batch-quantity-capsules">
                            Quantity Capsules
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber
                            v-model="state.batch.capsulesPerBottle"
                            inputId="batch-capsules-per-bottle"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="batch-capsules-per-bottle">
                            Capsules / Bottle
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber
                            v-model="state.batch.quantityBottles"
                            inputId="batch-quantity-bottles"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="batch-quantity-bottles">
                            Quantity Bottles
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber
                            v-model="state.batch.theoreticalWeightKg"
                            inputId="batch-theoretical-kg"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="batch-theoretical-kg">
                            Theoretical Kg
                        </label>
                    </FloatLabel>

                </div>
            </section>

            <!-- SHIPPING COSTS -->
            <section class="bg-white rounded-2xl shadow p-6"> 
                <h2 class="text-xl font-bold mb-4">
                    Shipping Costs
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <Checkbox v-model="state.customShipping" :binary="true" />

                    <FloatLabel
                        v-for="(value, key) in state.shippingCosts"
                        :key="key"
                    >
                        <InputNumber
                            v-model="state.shippingCosts[key]"
                            :inputId="`shipping-${key}`"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label :for="`shipping-${key}`">
                            {{ key }}
                        </label>
                    </FloatLabel>

                </div>

            </section>>

            <!-- PACKAGING COSTS -->
            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">
                    Packaging Costs
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <FloatLabel
                        v-for="(value, key) in state.packagingCosts"
                        :key="key"
                    >
                        <InputNumber
                            v-model="state.packagingCosts[key]"
                            :inputId="`packaging-${key}`"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label :for="`packaging-${key}`">
                            {{ key }}
                        </label>
                    </FloatLabel>

                </div>
            </section>

            <!-- FEES -->
            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">
                    Fees
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <FloatLabel
                        v-for="(value, key) in state.fees"
                        :key="key"
                    >
                        <InputNumber
                            v-model="state.fees[key]"
                            :inputId="`fee-${key}`"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label :for="`fee-${key}`">
                            {{ key }}
                        </label>
                    </FloatLabel>

                </div>
            </section>

            <!-- MATERIALS -->
            <section class="bg-white rounded-2xl shadow p-6">

                <div
                    class="flex justify-between items-center mb-4"
                >
                    <h2 class="text-xl font-bold">
                        Materials
                    </h2>

                    <button
                        @click="addMaterial"
                        class="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg transition"
                    >
                        Add Material
                    </button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse">

                        <thead>
                            <tr class="bg-gray-200">
                                <th class="border p-2 text-left">
                                    Name
                                </th>

                                <th class="border p-2 text-left">
                                    Type
                                </th>

                                <th class="border p-2 text-right">
                                    Mg Unit
                                </th>

                                <th class="border p-2 text-right">
                                    Total Kg
                                </th>

                                <th class="border p-2 text-right">
                                    Price / Kg
                                </th>

                                <th class="border p-2 text-right">
                                    Total Price
                                </th>

                                <th class="border p-2 text-right">
                                    Weight %
                                </th>

                                <th class="border p-2"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="(material, index) in state.materials"
                                :key="index"
                            >
                                <td class="border p-2">
                                    <InputText
                                        v-model="material.name"
                                        class="w-full"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputText
                                        v-model="material.type"
                                        class="w-full"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputNumber
                                        v-model="material.mgUnit"
                                        mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                                        class="w-full"
                                        inputClass="w-full text-right"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputNumber
                                        v-model="material.totalKg"
                                        mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                                        class="w-full"
                                        inputClass="w-full text-right"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputNumber
                                        v-model="material.priceKg"
                                        mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                                        class="w-full"
                                        inputClass="w-full text-right"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputNumber
                                        v-model="material.totalPrice"
                                        mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                                        class="w-full"
                                        inputClass="w-full text-right"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputNumber
                                        v-model="material.weightPercent"
                                        mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                                        class="w-full"
                                        inputClass="w-full text-right"
                                    />
                                </td>

                                <td
                                    class="border p-2 text-center"
                                >
                                    <button
                                        @click="removeMaterial(index)"
                                        class="delete-btn"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

                <div
                    class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div class="bg-gray-100 rounded p-3">
                        Total Kg:
                        {{ Number(totalKg || 0).toFixed(3) }}
                    </div>

                    <div class="bg-gray-100 rounded p-3">
                        Total Material Cost:
                        ${{ Number(totalMaterialCost || 0).toFixed(2) }}
                    </div>
                </div>

            </section>

            <!-- PHARMA ASSUMPTIONS -->
            <section class="bg-white rounded-2xl shadow p-6">
                <h2 class="text-xl font-bold mb-4">
                    Pharma Assumptions
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-5 gap-4">

                    <FloatLabel>
                        <InputNumber
                            v-model="state.pharmaAssumptions.yield.mean"
                            inputId="yield-mean"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="yield-mean">
                            Yield Mean
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber
                            v-model="state.pharmaAssumptions.yield.min"
                            inputId="yield-min"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="yield-min">
                            Yield Min
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber
                            v-model="state.pharmaAssumptions.yield.max"
                            inputId="yield-max"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="yield-max">
                            Yield Max
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber
                            v-model="state.pharmaAssumptions.yield.stdDev"
                            inputId="yield-std-dev"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="yield-std-dev">
                            Std Dev
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputNumber
                            v-model="state.pharmaAssumptions.batchFailureRatePercent"
                            inputId="batch-failure-rate-percent"
                            mode="decimal"
    :minFractionDigits="2"
    :maxFractionDigits="4"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label for="batch-failure-rate-percent">
                            Failure Rate %
                        </label>
                    </FloatLabel>

                </div>
            </section>

            <!-- Packaging Info -->
            <section class="bg-white rounded-2xl shadow p-6"> 
                <h2 class="text-xl font-bold mb-4">
                    Packaging Info
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <FloatLabel
                        v-for="(value, key) in state.packaging"
                        :key="key"
                    >
                        <InputText
                            v-model="state.packaging[key]"
                            class="w-full"
                        />

                        <label :for="`packaging-${key}`">
                            {{ key }}
                        </label>
                    </FloatLabel>

                </div>

            </section>

            <!-- Capsule info -->
            <section class="bg-white rounded-2xl shadow p-6"> 
                <h2 class="text-xl font-bold mb-4">
                    Capsule Info
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <FloatLabel
                        v-for="(value, key) in state.capsule"
                        :key="key"
                    >
                        <InputText        
                            v-model="state.capsule[key]"
                            class="w-full"
                            inputClass="w-full"
                        />

                        <label :for="`capsule-${key}`">
                            {{ key }}
                        </label>
                    </FloatLabel>

                </div>

            </section>

            <!-- SUPPLEMENT FACTS -->
            <section class="bg-white rounded-2xl shadow p-6">

                <div
                    class="flex justify-between items-center mb-4"
                >
                    <h2 class="text-xl font-bold">
                        Supplement Facts
                    </h2>

                    <button
                        @click="addFactRow"
                        class="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg transition"
                    >
                        Add Fact
                    </button>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                >

                    <FloatLabel>
                        <InputText
                            id="facts-serving-size"
                            v-model="state.facts.servingSize"
                            class="w-full"
                        />

                        <label for="facts-serving-size">
                            Serving Size
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText
                            id="facts-servings-per"
                            v-model="state.facts.servingsPer"
                            class="w-full"
                        />

                        <label for="facts-servings-per">
                            Servings Per
                        </label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText
                            id="facts-other-ingredients"
                            v-model="state.facts.otherIngredients"
                            class="w-full"
                        />

                        <label for="facts-other-ingredients">
                            Other Ingredients
                        </label>
                    </FloatLabel>

                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-sm border-collapse">

                        <thead>
                            <tr class="bg-gray-200">
                                <th class="border p-2 text-left">
                                    Name
                                </th>

                                <th class="border p-2 text-left">
                                    Amount
                                </th>

                                <th class="border p-2 text-left">
                                    DV
                                </th>

                                <th class="border p-2"></th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="(item, index) in state.facts.items"
                                :key="index"
                            >
                                <td class="border p-2">
                                    <InputText
                                        v-model="item.name"
                                        class="w-full"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputText
                                        v-model="item.amount"
                                        class="w-full"
                                    />
                                </td>

                                <td class="border p-2">
                                    <InputText
                                        v-model="item.dv"
                                        class="w-full"
                                    />
                                </td>

                                <td
                                    class="border p-2 text-center"
                                >
                                    <button
                                        @click="removeFactRow(index)"
                                        class="delete-btn"
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>

            </section>

        </div>
    </div>
</template>

<style scoped>
:deep(.p-float-label) {
    display: block;
    width: 100%;
    margin-top: 8px;
    margin-bottom: 12px;
}

:deep(.p-inputtext),
:deep(.p-inputnumber),
:deep(.p-inputnumber-input),
:deep(.p-select) {
    width: 100%;
}

.grid {
    row-gap: 18px !important;
}

:deep(.p-float-label label) {
    transform: translateY(-0.5rem);
    transition: all 0.15s ease;
    text-transform: capitalize;
}

:deep(.p-float-label input:focus ~ label),
:deep(.p-float-label .p-inputwrapper-focus ~ label),
:deep(.p-float-label input.p-filled ~ label),
:deep(.p-float-label .p-inputwrapper-filled ~ label) {
    transform: translateY(-1.2rem) scale(0.85);
}

.table-input {
    width: 100%;
    border: 1px solid transparent;
    padding: 6px;
    background: transparent;
    border-radius: 8px;
    box-sizing: border-box;
}

.delete-btn {
    border: none;
    background: #fee2e2;
    color: #b91c1c;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    line-height: 1;
    transition: all 0.15s ease;
}

.delete-btn:hover {
    background: #fecaca;
    transform: scale(1.05);
}

table th {
    font-weight: 700;
    white-space: nowrap;
}

table td,
table th {
    vertical-align: middle;
}

button {
    font-weight: 600;
}

section {
    transition: all 0.2s ease;
}
</style>
