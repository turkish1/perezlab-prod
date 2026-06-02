const API_URL =
    'https://bfgpekkkg4egxr7i2tjwtlvaim0riqdq.lambda-url.us-east-1.on.aws';

export async function loadProductList() {
    const res = await fetch(`${API_URL}?action=loadList`);

    if (!res.ok) {
        throw new Error('Failed to load product list');
    }

    return res.json();
}

export async function saveQuote(state) {
    console.log('name: ', state.product?.name);
    if (!state.product?.name) {
        throw new Error('Product name required');
    }

    console.log('Am I in here? ', state.value);

    const payload = {
        ...state,
        product: { name: state.product.name },
        lastUpdated: new Date().toISOString()
    };

    console.log('Payload to save: ', JSON.stringify(payload, null, 2));

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    console.log('Save response: ', await res.text());

    if (!res.ok) throw new Error('Save failed');

    try {
        return JSON.parse(text);
    } catch {
        return payload;
    }
}

export async function loadQuote(quoteId, state) {
    if (!quoteId) {
        throw new Error('Quote ID required');
    }

    console.log('Loading quote with ID:', quoteId);

    const res = await fetch(`${API_URL}/${encodeURIComponent(quoteId)}`);

    console.log('Response: ', res);

    if (!res.ok) {
        console.log('Load failed, initializing new quote');
        // await saveQuote(); // NEEDS TO BE PASSING FORM STATE.
    }

        packagingCosts: {
            bottle: 0.00,
            cap: 0.12,
            neckBand: 0.02,
            label: 0.00,
            applicationOfCotton: 0.00,
            silica: 0.00,
            innerBox: 0.00,
            masterBox: 0.00
        },

        shippingCosts:{
            bottlesPerBox: 0,
            customPalletAssembly: 0.00,
            customerShippingLabels: 0.00
        },

        fees: {
            encapsulation: 0.30, 
            overhead: 0.35,  // was 0.00 change
            packagingLabor: 0.35, // was defaulted to 0.00 waiting on user input. Preferrely, we may want a select box with different values.
            labFee: 0.00,

            qcTesting: 5000.00,
            qaLabor: 2000.00,
            facilityOverhead: 8000.00,
            stabilityTesting: 3000.00,
            regulatoryAmortization: 2000.00,
            depreciation: 4000.00,
            setupCost: 500.00
        },

        pricing: {
            bulkSelling: 0.00,
            bottleSelling: 0.00,
            originalBottleCost: 0.00,
            targetMarginPercent: 30.00
        },

        materials: [
            {
                name: '',
                type: '',
                mgUnit: 0.00,
                totalKg: 0.00,
                priceKg: 0.00,
                totalPrice: 0.00,
                weightPercent: 0.00
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
            averageCostPerBottle: 0.00,
            bestCaseCostPerBottle: 0.00,
            worstCaseCostPerBottle: 0.00,
            p10CostPerBottle: 0.00,
            p90CostPerBottle: 0.00,
            estimatedMarginPercent: 0.00
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
            bottlesPerMaster: '',
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

    try {
        const res = await fetch(
            `${API_URL}/${encodeURIComponent(productName)}`
        );

        // No document exists
        if (res.status === 404) {
            const blankQuote = createBlankQuote();

            // Auto-create it in DB
            await saveQuote(blankQuote);

            return blankQuote;
        }

        if (!res.ok) {
            throw new Error('Load failed');
        }

        const text = await res.text();

        // Empty response body
        if (!text) {
            const blankQuote = createBlankQuote();

            await saveQuote(blankQuote);

            return blankQuote;
        }

        const data = JSON.parse(text);

        // Null or invalid response
        if (!data || typeof data !== 'object') {
            const blankQuote = createBlankQuote();

            await saveQuote(blankQuote);

            return blankQuote;
        }

        return data;
    } catch (err) {
        console.error(err);

        // Final fallback
        const blankQuote = createBlankQuote();

        try {
            await saveQuote(blankQuote);
        } catch (e) {
            console.error(e);
        }

        return blankQuote;
    }
}

export async function getProducts() {
    const res = await fetch(`${API_URL}?action=loadList`, {
        method: 'GET'
    });

    if (!res.ok) {
        throw new Error('Product load failed');
    }

    return await res.json();
}

export async function simulateQuote(state) {
    if (!state.product?.name) {
        throw new Error('Quote ID required');
    }

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'simulate',
            data: {
                ...state,
                lastUpdated: new Date().toISOString()
            }
        })
    });

    if (!res.ok) {
        throw new Error('Simulation failed');
    }

    return res.json();
}