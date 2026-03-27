<script setup>
import { onMounted, ref } from 'vue';

const dropdownUnits = ref([
    { name: '100', code: 'Hundred' },
    { name: '1000', code: 'Thousand' },
    { name: '10000', code: 'Ten-thousand' },
    { name: '100000', code: 'Hundred-thousand' },
    { name: '1000000', code: 'Million' }
]);

const dropdownValues = ref([
    { name: 'Magnesium', code: 'MG' },
    { name: 'Vitamin D + K2', code: 'VD' },
    { name: 'Slippery', code: 'SP' },
    { name: 'CITICOLINE', code: 'CT' }
]);
const dropdownValue = ref(null);
const dropdownUnit = ref(null);

onMounted(() => {});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/3">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Select Product</div>
                <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />
            </div>
        </div>
        <div class="md:w-1/3">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Select Quantity</div>
                <Select v-model="dropdownUnit" :options="dropdownUnits" optionLabel="name" placeholder="Select" />
            </div>
        </div>
    </Fluid>

    <Fluid class="flex mt-8"> </Fluid>
</template>
