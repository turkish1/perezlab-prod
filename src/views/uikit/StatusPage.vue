<script setup>
import Status from '@/components/status/Status.vue';
import { ref } from 'vue';

// ✅ define steps
const steps = ['Order Placed', 'Order Received', 'Capsule Filling Stage', 'Packaging Stage', 'Ready for Pickup'];

// ✅ define current step
const currentStep = ref(0);

// ✅ functions
const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
        currentStep.value++;
    }
};

const prevStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
};
</script>

<template>
    <div class="card">
        <Status :currentStep="currentStep" :steps="steps" />
        <div>
            <h1>Current Step: {{ steps[currentStep] }}</h1>
        </div>
        <div>
            <Button @click="prevStep">Return to previous stage</Button>
            <br /><br />
            <Button @click="nextStep">Proceed to next stage</Button>
        </div>
    </div>
</template>
