<template>
    <div class="max-w-3xl mx-auto py-20 px-6">
        <h1 class="text-3xl font-bold mb-10">Frequently Asked Questions</h1>
        <div class="space-y-4">
            <div v-for="(item, index) in faqs" :key="index" class="border-b pb-4">
                <button @click="toggle(index)" class="w-full text-left flex justify-between items-center font-medium py-2">
                    {{ item.question }}
                    <span>{{ activeIndex === index ? '−' : '+' }}</span>
                </button>
                <div v-if="activeIndex === index" class="text-gray-600 mt-2 leading-relaxed">
                    {{ item.answer }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const activeIndex = ref(null);
const toggle = (i) => (activeIndex.value = activeIndex.value === i ? null : i);

const faqs = [
    { question: 'What form of quality control is used for pharmaceutical products?', answer: 'Our company, GMP-certified pharmaceutical products are produced under strict quality control standards.' },
    { question: 'Can I reach customer support fast?', answer: 'Yes, our support team is available 24/7 via email and live chat.' }
];
</script>
