<template>
    <div class="progress-container">
        <!-- Progress bar background -->
        <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>

        <!-- Steps -->
        <div class="steps">
            <div
                v-for="(step, index) in steps"
                :key="index"
                class="step"
                :class="{
                    active: index < props.currentStep,
                    current: index === props.currentStep
                }"
            >
                <div class="circle">{{ index + 1 }}</div>
                <div class="label">{{ step }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const currentStep = ref(0);
const maxSteps = 4;

// Increment
const nextStep = () => {
    if (currentStep.value < maxSteps) {
        currentStep.value++;
        index++;
    }
};

// Decrement
const prevStep = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
        index--;
    }
};

const props = defineProps({
    steps: {
        type: Array,
        default: () => ['Order Placed', 'Order Received', 'Capsule Filling Stage', 'Packaging Stage', 'Ready for Pickup']
    },
    currentStep: {
        type: Number,
        default: 0
    }
});

const progressPercent = computed(() => {
    return (props.currentStep / (props.steps.length - 1)) * 100;
});
</script>

<style scoped>
.progress-container {
    width: 100%;
    max-width: 600px;
    margin: 40px auto;
}

.progress-bar {
    height: 6px;
    background: #eee;
    border-radius: 4px;
    position: relative;
    margin-bottom: 30px;
}

.progress-fill {
    height: 100%;
    background: #0070f3;
    border-radius: 4px;
    transition: width 0.4s ease;
}

/* Steps layout */
.steps {
    display: flex;
    justify-content: space-between;
}

.step {
    text-align: center;
    flex: 1;
    position: relative;
}

.circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ccc;
    color: white;
    line-height: 28px;
    margin: 0 auto 8px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.label {
    font-size: 12px;
    color: #666;
}

/* Active steps */
.step.active .circle {
    background: #0070f3;
}

.step.current .circle {
    background: #ff4d4f;
    transform: scale(1.2);
}

/* Optional: connector line effect */
.step::after {
    content: '';
    position: absolute;
    top: 14px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: transparent;
}

.step:last-child::after {
    display: none;
}
</style>
