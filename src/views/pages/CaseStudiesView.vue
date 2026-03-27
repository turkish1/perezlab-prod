<template>
    <div class="container mx-auto py-20 px-4">
        <h1 class="text-4xl font-bold mb-4">Case Studies</h1>
        <p class="text-gray-500 mb-12">How industry leaders use our platform to scale.</p>

        <div class="grid md:grid-cols-2 gap-10">
            <div v-for="study in studies" :key="study.id" class="border rounded-xl p-8 hover:shadow-lg transition">
                <span class="text-sm font-bold uppercase tracking-widest text-primary-500">{{ study.tag }}</span>
                <h2 class="text-2xl font-bold mt-2 mb-4">{{ study.title }}</h2>
                <p class="text-gray-600 mb-6">{{ study.description }}</p>
                <button class="font-semibold text-surface-900">Read the full report →</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const studies = [
    { id: 1, tag: 'Fintech', title: 'Securing 10M+ Transactions', description: 'See how we helped Neobank reduce fraud by 15% using our real-time logic.' },
    { id: 2, tag: 'SaaS', title: 'Scaling to Series B', description: 'The infrastructure overhaul that allowed CloudScale to grow 400% in 6 months.' }
];
</script>
