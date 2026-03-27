import { defineStore } from 'pinia';

export const useProductStore = defineStore('product', {
    state: () => ({
        inputproduct: []
    }),
    actions: {
        addData(payload) {
            console.log('STORE addData payload:', payload);
            this.inputproduct = Array.isArray(payload) ? payload : [];
        }

        // addData(payload) {
        //     this.inputproduct = Array.isArray(payload) ? payload : (payload?.items ?? []);
        // }
    }
});
