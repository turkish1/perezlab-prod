<script setup>
import { getAuditTrail } from '@/composables/signingApi';
import { ref } from 'vue';

const id = ref('');
const audit = ref(null);

async function search() {
    audit.value = await getAuditTrail(id.value);
}
</script>

<template>
    <div class="page">
        <h1>Audit Trail</h1>

        <input v-model="id" placeholder="Signing request ID" />
        <button @click="search">Search</button>

        <div v-if="audit" class="card">
            <p>Status: {{ audit.status }}</p>
            <p>Signer: {{ audit.signer?.name }}</p>
            <p>Signed At: {{ audit.signedAt }}</p>

            <h3>Events</h3>

            <ul>
                <li v-for="event in audit.auditTrail" :key="event.timestamp">{{ event.action }} — {{ event.timestamp }} — {{ event.ipAddress }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.page {
    max-width: 700px;
    margin: 40px auto;
    display: grid;
    gap: 14px;
}

input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
}

button {
    padding: 12px;
    border: none;
    border-radius: 8px;
    background: #111827;
    color: white;
}

.card {
    padding: 20px;
    background: #f9fafb;
    border-radius: 12px;
}
</style>
