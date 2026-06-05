const API_URL = 'https://bfgpekkkg4egxr7i2tjwtlvaim0riqdq.lambda-url.us-east-1.on.aws';

import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

import { loadQuote, saveQuote, simulateQuote } from '@/composables/Cost/costApi.js';

export const useCostStore = defineStore('costStore', () => {
    const state = reactive({
        product: {
            company: '',
            name: '',
            type: '',
            date: new Date().toLocaleDateString('en-US')
        },

        batch: {
            quantityCapsules: 100000,
            capsulesPerBottle: 90,
            quantityBottles: 1111.11,
            theoreticalWeightKg: 51.15
        },

        packagingCosts: {
            bottle: 0.0,
            cap: 0.12,
            neckBand: 0.02,
            label: 0.0,
            applicationOfCotton: 0.0,
            silica: 0.0,
            innerBox: 0.0,
            masterBox: 0.0
        },

        shippingCosts: {
            bottlesPerBox: 0,
            customPalletAssembly: 0.0,
            customerShippingLabels: 0.0
        },

        fees: {
            encapsulation: 0.3,
            overhead: 0.35, // was 0.00 change
            packagingLabor: 0.35, // was defaulted to 0.00 waiting on user input. Preferrely, we may want a select box with different values.
            labFee: 0.0,

            qcTesting: 5000.0,
            qaLabor: 2000.0,
            facilityOverhead: 8000.0,
            stabilityTesting: 3000.0,
            regulatoryAmortization: 2000.0,
            depreciation: 4000.0,
            setupCost: 500.0
        },

        pricing: {
            bulkSelling: 0.0,
            bottleSelling: 0.0,
            originalBottleCost: 0.0,
            targetMarginPercent: 30.0
        },

        materials: [
            {
                name: '',
                type: '',
                mgUnit: 0.0,
                totalKg: 0.0,
                priceKg: 0.0,
                totalPrice: 0.0,
                weightPercent: 0.0
            }
        ],

        pharmaAssumptions: {
            yield: {
                mean: 95,
                min: 92,
                max: 98,
                stdDev: 1.5
            },
            batchFailureRatePercent: 2
        },

        pharmaResults: {
            averageCostPerBottle: 0.0,
            bestCaseCostPerBottle: 0.0,
            worstCaseCostPerBottle: 0.0,
            p10CostPerBottle: 0.0,
            p90CostPerBottle: 0.0,
            estimatedMarginPercent: 0.0
        },

        packaging: {
            bottleDescription: '',
            capDescription: '',
            neckBandDescription: '',
            cotton: '',
            silica: '',
            label: '',
            innerBox: '',
            masterBoxQty: '',
            masterBoxPack: '',
            bottlesPerMaster: ''
        },

        capsule: {
            size: '',
            weightMg: '',
            color: '',
            emptyCapsule: '',
            weightMg: ''
        },

        facts: {
            servingSize: '',
            servingsPer: '',
            items: [
                {
                    name: '',
                    amount: '',
                    dv: ''
                }
            ],
            otherIngredients: ''
        },

        lastUpdated: '',

        customShipping: false
    });

    const loading = reactive({
        save: false,
        load: false,
        simulation: false,
        products: false
    });

    const productOptions = reactive({
        items: []
    });

    const totalMaterialCost = computed(() => {
        return state.materials.reduce((sum, item) => {
            return sum + Number(item.totalPrice || 0);
        }, 0);
    });

    const totalKg = computed(() => {
        return state.materials.reduce((sum, item) => {
            return sum + Number(item.totalKg || 0);
        }, 0);
    });

    const packagingCostPerBottle = computed(() => {
        return (
            Number(state.packagingCosts.bottle || 0) +
            Number(state.packagingCosts.cap || 0) +
            Number(state.packagingCosts.neckBand || 0) +
            Number(state.packagingCosts.label || 0) +
            Number(state.packagingCosts.applicationOfCotton || 0) +
            Number(state.packagingCosts.silica || 0) +
            Number(state.packagingCosts.innerBox || 0) +
            Number(state.packagingCosts.masterBox || 0)
        );
    });

    const feeCostPerBottle = computed(() => {
        return Number(state.fees.encapsulation || 0) + Number(state.fees.overhead || 0) + Number(state.fees.packagingLabor || 0) + Number(state.fees.labFee || 0) + Number(state.fees.facilityOverhead / state.batch.quantityBottles || 0);
    });

    const originalBottleCost = computed(() => {
        const tempShipLabels = state.shippingCosts.customerShippingLabels;
        const tempCustPallet = state.shippingCosts.customPalletAssembly;
        const tempBottBox = state.shippingCosts.bottlesPerBox;

        if (state.customShipping == false) {
            state.shippingCosts.customerShippingLabels = 0;
            state.shippingCosts.customPalletAssembly = 0;
            state.shippingCosts.bottlesPerBox = 100;
        }

        const totalSum =
            packagingCostPerBottle.value +
            feeCostPerBottle.value +
            //setupCost
            state.fees.setupCost / state.batch.quantityBottles +
            // Custom Shipping stuff here, only if box is checked
            state.shippingCosts.customerShippingLabels +
            state.shippingCosts.customPalletAssembly +
            1 / state.shippingCosts.bottlesPerBox +
            // ADDING STUFF HERE
            state.materials.reduce((sum, item) => {
                return sum + Number(item.totalPrice || 0);
            }, 0) /
                state.batch.quantityBottles;

        if (state.customShipping == false) {
            state.shippingCosts.customerShippingLabels = tempShipLabels;
            state.shippingCosts.customPalletAssembly = tempCustPallet;
            state.shippingCosts.bottlesPerBox = tempBottBox;
        }

        return totalSum;
    });

    const bottleSellingPrice = computed(() => {
        const marginDecimal = Number(state.pricing.targetMarginPercent || 0) / 100;

        const totalBottlePrice = originalBottleCost.value / (1 - marginDecimal);
        return totalBottlePrice;
    });

    const pharmaMarginPercent = computed(() => {
        const price = Number(state.pricing.bottleSelling || bottleSellingPrice.value || 0);

        const cost = Number(state.pharmaResults.averageCostPerBottle || 0);

        if (!price || !cost) {
            return 0;
        }

        return ((price - cost) / price) * 100;
    });

    function refreshPricing() {
        state.pricing.originalBottleCost = Number(originalBottleCost.value.toFixed(2));

        state.pricing.bottleSelling = Number(bottleSellingPrice.value.toFixed(2));
    }

    async function fetchProducts() {
        loading.products = true;

        try {
            const res = await fetch(`${API_URL}?action=loadList`);

            const data = await res.json();

            console.log('Got products:', data);

            productOptions.items = data.map((item) => ({
                label: `${item.sku} - ${item.name}`,
                value: item.name,
                raw: item
            }));

            console.log(productOptions.items);
        } catch (e) {
            console.error(e);
        } finally {
            loading.products = false;
        }
    }

    async function load() {
        if (!state.product.name) {
            alert('Select a Product');
            return false;
        }

        loading.load = true;

        try {
            const data = await loadQuote(state.product.name);

            if (data) {
                Object.assign(state, data);
            } else {
                alert('Not Found');
            }
        } catch (e) {
            console.error(e);
            alert('Load Failed');
        } finally {
            // loading.load = false;
            return true;
        }
    }

    async function save() {
        if (!state.product.name) {
            alert('Select a Product');
            return;
        }

        loading.save = true;

        try {
            refreshPricing();

            const data = await saveQuote(state);

            if (data) {
                Object.assign(state, data);
            }

            alert('Quote Saved');
        } catch (e) {
            console.error(e);
            alert('Save Failed');
        } finally {
            loading.save = false;
        }
    }

    async function simulate() {
        if (!state.product.name) {
            alert('Select a Product');
            return;
        }

        loading.simulation = true;

        try {
            refreshPricing();

            const result = await simulateQuote(state);

            if (result.pharmaResults) {
                state.pharmaResults = result.pharmaResults;
            } else {
                state.pharmaResults = result;
            }

            alert('Simulation Complete');
        } catch (e) {
            console.error(e);
            alert('Simulation Failed');
        } finally {
            loading.simulation = false;
        }
    }

    function addMaterial() {
        state.materials.push({
            name: '',
            type: '',
            mgUnit: 0,
            totalKg: 0,
            priceKg: 0,
            totalPrice: 0,
            weightPercent: 0
        });
    }

    function removeMaterial(index) {
        state.materials.splice(index, 1);
    }

    function addFactRow() {
        state.facts.items.push({
            name: '',
            amount: '',
            dv: ''
        });
    }

    function removeFactRow(index) {
        state.facts.items.splice(index, 1);
    }

    return {
        state,
        loading,
        productOptions,

        totalMaterialCost,
        totalKg,
        packagingCostPerBottle,
        feeCostPerBottle,
        originalBottleCost,
        bottleSellingPrice,
        pharmaMarginPercent,

        fetchProducts,
        load,
        save,
        simulate,

        addMaterial,
        removeMaterial,
        addFactRow,
        removeFactRow
    };
});
