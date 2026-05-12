<script setup>
import { getSigningRequest, signDocument } from '@/composables/signingApi';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const request = ref(null);
const signature = ref('');
const signed = ref(false);

onMounted(async () => {
    request.value = await getSigningRequest(route.params.id);
});

async function submitSignature() {
    const result = await signDocument(route.params.id, {
        signatureType: 'typed',
        signatureValue: signature.value
    });

    if (result.message) {
        signed.value = true;
    }
}
</script>

<template>
    <div class="page" v-if="request">
        <h1>Sign Document</h1>

        <div class="card">
            <h2>{{ request.documentTitle }}</h2>
            <p>Status: {{ request.status }}</p>

            <a :href="request.documentUrl" target="_blank"> View Document </a>
        </div>

        <div v-if="request.status === 'pending' && !signed" class="signature-box">
            <label>Type your legal signature</label>
            <input v-model="signature" placeholder="Full legal name" />

            <button :disabled="!signature" @click="submitSignature">Sign Document</button>
        </div>

        <div v-else class="signed">Document signed successfully.</div>
    </div>
</template>

<style scoped>
.page {
    max-width: 700px;
    margin: 40px auto;
    display: grid;
    gap: 20px;
}

.card,
.signature-box,
.signed {
    padding: 20px;
    border-radius: 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
}

input {
    width: 100%;
    padding: 14px;
    margin-top: 10px;
    margin-bottom: 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

button {
    padding: 12px 18px;
    border: none;
    border-radius: 8px;
    background: #111827;
    color: white;
    cursor: pointer;
}

button:disabled {
    background: #9ca3af;
}
</style>
