// import storeReset from '@/composables/Reset/reset-store';
import { defineStore } from 'pinia';
export const useInventoryStore = defineStore('inputdata', {
    //state
    state: () => ({
        inputdata: [],
        id: 0
    }),

    //actions
    actions: {
        addData(inventoryData) {
            this.inputdata.push({ inventoryData, completed: false });
        },
        reset() {
            this.inventoryData = [];
        }
    },

    //getters

    getters: {
        Data: (state) => state.inventoryData
    }

    // persist: true
});
