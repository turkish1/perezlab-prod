<script setup>
import { createSigningRequest } from '@/composables/signingApi';
import { ref } from 'vue';

const form = ref({
    documentTitle: '',
    documentUrl: '',
    signerName: '',
    signerEmail: ''
});

const createdLink = ref('');

async function submit() {
    const result = await createSigningRequest(form.value);

    if (result.id) {
        createdLink.value = `${window.location.origin}/sign/${result.id}`;
    }
}
</script>

<template>
    <div class="page">
        <h1>Create Signing Request</h1>

        <input v-model="form.documentTitle" placeholder="Document title" />
        <input v-model="form.documentUrl" placeholder="Document URL" />
        <input v-model="form.signerName" placeholder="Signer name" />
        <input v-model="form.signerEmail" placeholder="Signer email" />

        <button @click="submit">Create Request</button>

        <div v-if="createdLink" class="result">
            <p>Signing link:</p>
            <a :href="createdLink" target="_blank">{{ createdLink }}</a>
        </div>
    </div>
</template>

<style scoped>
.page {
    max-width: 600px;
    margin: 40px auto;
    display: grid;
    gap: 14px;
}

input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #111827;
    color: white;
    cursor: pointer;
}

.result {
    padding: 16px;
    background: #f3f4f6;
    border-radius: 8px;
}
</style>
