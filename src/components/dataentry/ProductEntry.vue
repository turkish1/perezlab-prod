<template>
    <div class="component-card">
        <h3>📥 Raw Material Entry</h3>
        <form @submit.prevent="submitEntry">
            <div class="grid-form">
                <!-- RM Search/Select -->
                <div class="form-group">
                    <label>RM Code:</label>
                    <input v-model="form.RM" list="rm-list" placeholder="e.g. RM0001" required />
                    <datalist id="rm-list">
                        <option v-for="item in inventoryList" :key="item.RM" :value="item.RM">
                            {{ item.DESCRIPTION }}
                        </option>
                    </datalist>
                </div>

                <div class="form-group">
                    <label>Vendor:</label>
                    <input v-model="form.VENDOR" type="text" placeholder="Supplier Name" />
                </div>

                <div class="form-group">
                    <label>Quantity:</label>
                    <input v-model.number="form.QUANTITY" type="number" step="0.01" required />
                </div>

                <div class="form-group">
                    <label>Location:</label>
                    <input v-model="form.LOCATION" type="text" placeholder="e.g. 1A" />
                </div>
            </div>
            <button type="submit" class="btn-entry">Record Entry</button>
        </form>
    </div>
</template>

<script>
export default {
    props: ['inventoryList'], // Pass your inventory.json data here
    data() {
        return {
            form: { RM: '', VENDOR: '', QUANTITY: 0, LOCATION: '', DATE: new Date().toLocaleDateString() }
        };
    },
    methods: {
        submitEntry() {
            console.log('Saving to product_entry collection:', this.form);
            this.$emit('save-entry', this.form);
            // Reset form logic...
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
