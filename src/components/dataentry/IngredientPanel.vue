<script setup>
import { useApi } from '@/composables/dataentrylogic/useApi';
import { reactive, ref } from 'vue';

const props = defineProps({
    apiBase: String,
    ingredients: Array
});
const emit = defineEmits(['refresh']);

const api = useApi(props.apiBase);

const form = reactive({
    _id: null,
    name: '',
    source: '',
    specifications: '',
    safetyProfile: ''
});

const editing = ref(false);

function reset() {
    form._id = null;
    form.name = '';
    form.source = '';
    form.specifications = '';
    form.safetyProfile = '';
    editing.value = false;
}

function startEdit(i) {
    editing.value = true;
    form._id = i._id;
    form.name = i.name || '';
    form.source = i.source || '';
    form.specifications = i.specifications || '';
    form.safetyProfile = i.safetyProfile || '';
}

async function save() {
    const payload = {
        name: form.name.trim(),
        source: form.source.trim(),
        specifications: form.specifications.trim(),
        safetyProfile: form.safetyProfile.trim()
    };

    if (!payload.name) return alert('Ingredient name is required.');

    if (editing.value && form._id) {
        await api.request(`/ingredients/${form._id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    } else {
        await api.request(`/ingredients`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    reset();
    emit('refresh');
}

async function remove(i) {
    if (!confirm(`Delete ingredient "${i.name}"?`)) return;
    await api.request(`/ingredients/${i._id}`, { method: 'DELETE' });
    emit('refresh');
}
</script>

<template>
    <section class="panel">
        <header class="head">
            <h2>Ingredients</h2>
            <button class="ghost" @click="reset" v-if="editing">Cancel edit</button>
        </header>

        <div class="grid">
            <form class="card" @submit.prevent="save">
                <div class="card-title">{{ editing ? 'Edit Ingredient' : 'New Ingredient' }}</div>

                <label>
                    <span>Name *</span>
                    <input v-model="form.name" placeholder="e.g., Fish Oil (Omega-3)" />
                </label>

                <label>
                    <span>Source</span>
                    <input v-model="form.source" placeholder="e.g., Anchovy" />
                </label>

                <label>
                    <span>Specifications</span>
                    <textarea v-model="form.specifications" rows="3" placeholder="e.g., EPA 180 / DHA 120 per 1000mg"></textarea>
                </label>

                <label>
                    <span>Safety Profile</span>
                    <textarea v-model="form.safetyProfile" rows="3" placeholder="e.g., GRAS / warnings / allergens"></textarea>
                </label>

                <div class="actions">
                    <button class="primary" type="submit">{{ editing ? 'Update' : 'Create' }}</button>
                    <button class="muted" type="button" @click="reset">Clear</button>
                </div>

                <div v-if="api.error" class="small error">Error: {{ api.error }}</div>
            </form>

            <div class="card">
                <div class="card-title">Existing Ingredients ({{ props.ingredients?.length || 0 }})</div>

                <div class="table">
                    <div class="row header">
                        <div>Name</div>
                        <div>Source</div>
                        <div class="right">Actions</div>
                    </div>

                    <div v-for="i in props.ingredients" :key="i._id" class="row">
                        <div class="bold">{{ i.name }}</div>
                        <div class="dim">{{ i.source || '-' }}</div>
                        <div class="right">
                            <button class="ghost" @click="startEdit(i)">Edit</button>
                            <button class="danger" @click="remove(i)">Delete</button>
                        </div>
                    </div>

                    <div v-if="!props.ingredients?.length" class="empty">No ingredients yet.</div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
h2 {
    margin: 0;
    font-size: 18px;
}
.grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 12px;
}
@media (max-width: 900px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

.card {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    border-radius: 14px;
    padding: 14px;
}
.card-title {
    font-weight: 800;
    margin-bottom: 10px;
    opacity: 0.9;
}

label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10px;
}
label span {
    font-size: 12px;
    opacity: 0.75;
}
input,
textarea {
    border-radius: 10px;
    padding: 10px 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.18);
    color: inherit;
    outline: none;
}
textarea {
    resize: vertical;
}

.actions {
    display: flex;
    gap: 8px;
    margin-top: 6px;
}

button {
    border-radius: 10px;
    padding: 9px 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: inherit;
    cursor: pointer;
}
button.primary {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.22);
    font-weight: 700;
}
button.muted {
    opacity: 0.85;
}
button.ghost {
    background: transparent;
}
button.danger {
    background: rgba(255, 0, 0, 0.1);
    border-color: rgba(255, 0, 0, 0.22);
}

.table {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.row {
    display: grid;
    grid-template-columns: 1.3fr 1fr 160px;
    gap: 10px;
    padding: 10px;
    border-radius: 12px;
}
.row.header {
    opacity: 0.7;
    font-size: 12px;
    padding-top: 6px;
    padding-bottom: 6px;
}
.row:not(.header) {
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.14);
}
.right {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
.bold {
    font-weight: 700;
}
.dim {
    opacity: 0.75;
}
.empty {
    opacity: 0.7;
    padding: 10px;
}
.small {
    margin-top: 10px;
    font-size: 12px;
}
.error {
    color: #ffb3b3;
}
</style>
