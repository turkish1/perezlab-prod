<template>
    <div class="component-card">
        <h3 style="color: #d9534f">📤 Raw Material Exit</h3>
        <form @submit.prevent="submitExit">
            <div class="grid-form">
                <div class="form-group">
                    <label>RM Code:</label>
                    <input v-model="form.RM" list="rm-list" required />
                </div>

                <div class="form-group">
                    <label>Customer/Project:</label>
                    <input v-model="form.CUSTOMER" type="text" placeholder="Internal or External" />
                </div>

                <div class="form-group">
                    <label>Quantity Used:</label>
                    <input v-model.number="form.QUANTITY" type="number" step="0.01" required />
                </div>

                <div class="form-group">
                    <label>Final Product:</label>
                    <input v-model="form.PRODUCT" type="text" placeholder="e.g. D3 & K2 Lot" />
                </div>
            </div>
            <button type="submit" class="btn-exit">Record Exit</button>
        </form>
    </div>
</template>

<script>
export default {
    props: ['inventoryList'],
    data() {
        return {
            form: { RM: '', CUSTOMER: '', QUANTITY: 0, PRODUCT: '', DATE: new Date().toLocaleDateString() }
        };
    },
    methods: {
        submitExit() {
            console.log('Saving to product_exit collection:', this.form);
            this.$emit('save-exit', this.form);
        }
    }
};
</script>

<style scoped>
.component-card {
    background: #1a1a1a;
    color: #00ff00; /* Terminal Green */
    padding: 20px;
    border: 1px solid #333;
    border-radius: 4px;
    font-family: 'Courier New', Courier, monospace;
}

.grid-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 5px;
}

input {
    width: 100%;
    background: #000;
    border: 1px solid #00ff00;
    color: #00ff00;
    padding: 8px;
}

.btn-entry {
    background: #28a745;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 100%;
}
.btn-exit {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    width: 100%;
}
</style>
