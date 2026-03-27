<script setup>
import { useApi } from '@/composables/dataentrylogic/useApi';
import { computed, reactive, ref } from 'vue';

const props = defineProps({
    apiBase: String,
    products: Array,
    ingredients: Array
});
const emit = defineEmits(['refreshProducts', 'refreshIngredients']);

const api = useApi(props.apiBase);

const editing = ref(false);

const form = reactive({
    _id: null,
    productName: '',
    category: '',
    description: '',
    formulation: [] // [{ ingredientId, amount }]
});

const addLine = () => {
    form.formulation.push({ ingredientId: '', amount: '' });
};

const removeLine = (idx) => {
    form.formulation.splice(idx, 1);
};

function reset() {
    form._id = null;
    form.productName = '';
    form.category = '';
    form.description = '';
    form.formulation = [];
    editing.value = false;
}

function startEdit(p) {
    editing.value = true;
    form._id = p._id;
    form.productName = p.productName || '';
    form.category = p.category || '';
    form.description = p.description || '';

    // normalize formulation
    const f = Array.isArray(p.formulation) ? p.formulation : [];
    form.formulation = f.map((x) => ({
        ingredientId: (x.ingredientId && (x.ingredientId._id || x.ingredientId)) || '',
        amount: x.amount || ''
    }));
    if (!form.formulation.length) addLine();
}

const ingredientMap = computed(() => {
    const m = new Map();
    (props.ingredients || []).forEach((i) => m.set(i._id, i));
    return m;
});

function ingredientName(id) {
    const i = ingredientMap.value.get(id);
    return i ? i.name : '(missing)';
}

async function save() {
    const payload = {
        productName: form.productName.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        formulation: (form.formulation || []).filter((x) => x.ingredientId && x.amount).map((x) => ({ ingredientId: x.ingredientId, amount: x.amount.trim() }))
    };

    if (!payload.productName) return alert('Product name is required.');
    if (!payload.category) return alert('Category is required.');
    if (!payload.formulation.length) return alert('Add at least one formulation line (ingredient + amount).');

    if (editing.value && form._id) {
        await api.request(`/products/${form._id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    } else {
        await api.request(`/products`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    reset();
    emit('refreshProducts');
}

async function removeProduct(p) {
    if (!confirm(`Delete product "${p.productName}"?`)) return;
    await api.request(`/products/${p._id}`, { method: 'DELETE' });
    emit('refreshProducts');
}
</script>

<template>
    <section class="panel">
        <header class="head">
            <h2>Products</h2>
            <button class="ghost" @click="reset" v-if="editing">Cancel edit</button>
        </header>

        <div class="grid">
            <form class="card" @submit.prevent="save">
                <div class="card-title">{{ editing ? 'Edit Product' : 'New Product' }}</div>

                <label>
                    <span>Product Name *</span>
                    <input v-model="form.productName" placeholder="e.g., Omega-3 Daily Supplement" />
                </label>

                <div class="two">
                    <label>
                        <span>Category *</span>
                        <input v-model="form.category" placeholder="e.g., Softgel / Capsule / Powder" />
                    </label>

                    <label>
                        <span>Short Description</span>
                        <input v-model="form.description" placeholder="Optional summary" />
                    </label>
                </div>

                <div class="divider"></div>

                <div class="row-title">
                    <div>Formulation *</div>
                    <button class="ghost" type="button" @click="addLine">+ Add line</button>
                </div>

                <div class="formulation">
                    <div v-for="(line, idx) in form.formulation" :key="idx" class="line">
                        <select v-model="line.ingredientId">
                            <option value="">Select ingredient</option>
                            <option v-for="i in props.ingredients" :key="i._id" :value="i._id">
                                {{ i.name }}
                            </option>
                        </select>

                        <input v-model="line.amount" placeholder="Amount (e.g., 1000 mg, 500 IU)" />

                        <button type="button" class="danger" @click="removeLine(idx)" :disabled="form.formulation.length <= 1">Remove</button>
                    </div>

                    <div v-if="!props.ingredients?.length" class="hint">You have no ingredients yet. Create ingredients first.</div>
                    <div v-if="!form.formulation.length" class="hint">Click “Add line” to start.</div>
                </div>

                <div class="actions">
                    <button class="primary" type="submit">{{ editing ? 'Update' : 'Create' }}</button>
                    <button class="muted" type="button" @click="reset">Clear</button>
                </div>

                <div v-if="api.error" class="small error">Error: {{ api.error }}</div>
            </form>

            <div class="card">
                <div class="card-title">Existing Products ({{ props.products?.length || 0 }})</div>

                <div class="table">
                    <div class="row header">
                        <div>Product</div>
                        <div>Category</div>
                        <div>Formulation</div>
                        <div class="right">Actions</div>
                    </div>

                    <div v-for="p in props.products" :key="p._id" class="row">
                        <div>
                            <div class="bold">{{ p.productName }}</div>
                            <div class="dim" v-if="p.description">{{ p.description }}</div>
                        </div>

                        <div class="dim">{{ p.category }}</div>

                        <div class="dim">
                            <div v-if="Array.isArray(p.formulation) && p.formulation.length">
                                <div v-for="(f, i) in p.formulation" :key="i" class="pill">{{ ingredientName((f.ingredientId && (f.ingredientId._id || f.ingredientId)) || '') }} — {{ f.amount }}</div>
                            </div>
                            <div v-else class="dim">—</div>
                        </div>

                        <div class="right">
                            <button class="ghost" @click="startEdit(p)">Edit</button>
                            <button class="danger" @click="removeProduct(p)">Delete</button>
                        </div>
                    </div>

                    <div v-if="!props.products?.length" class="empty">No products yet.</div>
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
    grid-template-columns: 1fr 1.35fr;
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

.two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}
@media (max-width: 700px) {
    .two {
        grid-template-columns: 1fr;
    }
}

input,
select {
    border-radius: 10px;
    padding: 10px 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(0, 0, 0, 0.18);
    color: inherit;
    outline: none;
}

.divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 12px 0;
}

.row-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-weight: 700;
}

.formulation {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.line {
    display: grid;
    grid-template-columns: 1.2fr 1fr 110px;
    gap: 8px;
}
@media (max-width: 700px) {
    .line {
        grid-template-columns: 1fr;
    }
}

.hint {
    font-size: 12px;
    opacity: 0.75;
    padding: 6px 2px;
}

.actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
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
button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.table {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.row {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 1.6fr 160px;
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
@media (max-width: 900px) {
    .row {
        grid-template-columns: 1fr;
    }
    .right {
        justify-content: flex-start;
    }
}
.right {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    align-items: flex-start;
}
.bold {
    font-weight: 800;
}
.dim {
    opacity: 0.75;
}
.pill {
    display: inline-block;
    padding: 4px 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    margin: 0 6px 6px 0;
    background: rgba(255, 255, 255, 0.04);
    font-size: 12px;
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
