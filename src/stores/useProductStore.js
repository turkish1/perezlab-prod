import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
    state: () => ({
        inputproduct: []
    }),
    actions: {
        addData(payload) {
            this.inputproduct = Array.isArray(payload) ? payload : [];
        }
    }
});
