<template>
    <Fluid class="flex flex-col md:flex-row gap-8">
        <div class="card flex flex-col gap-4">
            <div class="font-semibold text-xl">Select</div>
            <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />
        </div>
    </Fluid>
</template>
<script setup>
import { ref } from 'vue';
import Fluid from '../../../node_modules/primevue/fluid/Fluid.vue';
import Select from '../../../node_modules/primevue/select/Select.vue';
const dropdownValues = ref([
    { name: 'Magnisium', code: 'MG' },
    { name: 'Vitamin D + K2', code: 'VD' },
    { name: 'Slippery', code: 'SP' },
    { name: 'CITICOLINE', code: 'CT' }
]);
const dropdownValue = ref(null);
</script>
