<template>
  <div class="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-800">
    <header class="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-blue-600 flex justify-between items-center">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
        <div v-for="(val, key) in state.product" :key="key">
          <label class="block text-[10px] font-bold text-gray-400 uppercase">{{ key }}</label>
          <input v-model="state.product[key]" class="w-full border-b py-1 outline-none focus:border-blue-500 bg-transparent" />
        </div>
      </div>
      <div class="ml-6 flex gap-2">
        <button @click="loadFromAWS" class="bg-gray-200 px-6 py-2 rounded font-bold text-xs uppercase hover:bg-gray-300">Load</button>
        <button @click="saveToAWS" class="bg-green-600 text-white px-6 py-2 rounded font-bold text-xs uppercase hover:bg-green-700">Save to AWS</button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="space-y-6">
        <section class="bg-white p-5 rounded shadow-sm border-t-2 border-blue-100">
          <h3 class="text-xs font-bold mb-4 text-blue-600 uppercase border-b pb-1">Packaging & Box Costs</h3>
          <div class="space-y-2">
            <div v-for="(val, key) in state.packagingCosts" :key="key" class="flex justify-between items-center">
              <label class="text-[10px] text-gray-500 font-semibold uppercase">{{ key }}</label>
              <input v-model.number="state.packagingCosts[key]" type="number" step="0.001" class="text-right border-b w-24 outline-none text-sm" />
            </div>
          </div>
        </section>

        <section class="bg-white p-5 rounded shadow-sm border-t-2 border-orange-100">
          <h3 class="text-xs font-bold mb-4 text-orange-600 uppercase border-b pb-1">Labor, Overhead & Fees</h3>
          <div class="space-y-2">
            <div v-for="(val, key) in state.fees" :key="key" class="flex justify-between items-center">
              <label class="text-[10px] text-gray-500 font-semibold uppercase">{{ key }}</label>
              <input v-model.number="state.fees[key]" type="number" step="0.001" class="text-right border-b w-24 outline-none text-sm" />
            </div>
          </div>
        </section>

        <section class="bg-white p-5 rounded shadow-sm border-t-2 border-green-100">
          <h3 class="text-xs font-bold mb-4 text-green-600 uppercase border-b pb-1">Pricing Analysis</h3>
          <div class="space-y-4">
            <div class="p-2 bg-green-50 rounded">
              <label class="block text-[10px] font-bold text-green-500 uppercase">Bulk Selling Price ($)</label>
              <input v-model.number="state.pricing.bulkSelling" type="number" class="w-full text-lg font-bold bg-transparent outline-none" />
            </div>
            <div class="p-2 bg-blue-50 rounded">
              <label class="block text-[10px] font-bold text-blue-500 uppercase">Bottle Selling Price ($)</label>
              <input v-model.number="state.pricing.bottleSelling" type="number" class="w-full text-lg font-bold bg-transparent outline-none" />
            </div>
          </div>
        </section>
      </div>

      <div class="lg:col-span-2 space-y-6">
        <section class="bg-white p-5 rounded shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-bold text-gray-700 uppercase">Formulation (Raw Materials)</h3>
            <button @click="addMaterial" class="text-[10px] bg-blue-600 text-white px-3 py-1 rounded uppercase font-bold">+ Add Ingredient</button>
          </div>
          <table class="w-full text-xs text-left">
            <thead class="bg-gray-50 text-gray-400 uppercase font-bold border-b">
              <tr>
                <th class="p-2">Description</th>
                <th class="p-2 text-right">mg/Unit</th>
                <th class="p-2 text-right">Price/Kg ($)</th>
                <th class="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in state.materials" :key="index" class="border-b hover:bg-gray-50">
                <td class="p-1"><input v-model="item.name" class="w-full bg-transparent outline-none p-1" /></td>
                <td class="p-1"><input v-model.number="item.mgUnit" type="number" class="w-20 text-right outline-none bg-transparent" /></td>
                <td class="p-1"><input v-model.number="item.priceKg" type="number" class="w-20 text-right outline-none bg-transparent" /></td>
                <td class="p-1 text-center"><button @click="state.materials.splice(index, 1)" class="text-red-400 hover:text-red-600 text-lg">&times;</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="bg-white p-6 rounded shadow-sm border-2 border-black max-w-md mx-auto">
          <h2 class="text-2xl font-black uppercase mb-1 leading-none">Supplement Facts</h2>
          <div class="border-b-4 border-black mb-2 flex justify-between text-xs font-bold py-1">
            <span>Serving Size: <input v-model="state.facts.servingSize" class="border-none w-24 p-0 outline-none" /></span>
            <span>Servings: <input v-model="state.facts.servingsPer" class="border-none w-10 text-right p-0 outline-none" /></span>
          </div>
          
          <div class="border-b-2 border-black text-[10px] font-bold mb-1 flex justify-between uppercase">
            <span>Amount Per Serving</span>
            <span>% DV</span>
          </div>

          <div v-for="(fact, index) in state.facts.items" :key="index" class="flex justify-between border-b border-gray-300 py-1 text-xs items-center group relative">
            <input v-model="fact.name" class="font-bold w-1/2 outline-none p-0 border-none focus:ring-0" placeholder="Ingredient" />
            <input v-model="fact.amount" class="text-right w-1/4 outline-none p-0 border-none focus:ring-0" placeholder="0mg" />
            <input v-model="fact.dv" class="text-right w-10 outline-none p-0 border-none focus:ring-0" placeholder="0%" />
            <button @click="state.facts.items.splice(index, 1)" class="text-red-500 font-bold ml-2 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
          </div>
          
          <button @click="addFactRow" class="mt-4 text-[10px] text-blue-600 font-bold uppercase hover:underline">+ Add Label Row</button>
          
          <div class="mt-4 text-[9px] leading-tight">
            <p>* Daily Value not established.</p>
            <p class="font-bold border-t border-black mt-1 pt-1">Other Ingredients: <input v-model="state.facts.otherIngredients" class="w-full border-b border-gray-200 mt-1" /></p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const API_URL = 'https://bfgpekkkg4egxr7i2tjwtlvaim0riqdq.lambda-url.us-east-1.on.aws/ ';

const state = reactive({
  product: { company: '', name: '', quote: '', date: '' },
  packagingCosts: {
    bottle: 0,
    cap: 0,
    neckBand: 0,
    label: 0,
    cotton: 0,
    silica: 0,
    innerBox: 0,
    masterBox: 0
  },
  fees: {
    encapsulation: 0,
    overhead: 0,
    packagingLabor: 0,
    labFee: 0
  },
  pricing: { bulkSelling: 0, bottleSelling: 0 },
  materials: [],
  facts: {
    servingSize: '2 Capsules',
    servingsPer: '45',
    items: [],
    otherIngredients: 'Gelatin, Magnesium Stearate'
  }
});

const addMaterial = () => state.materials.push({ name: '', mgUnit: 0, priceKg: 0 });
const addFactRow = () => state.facts.items.push({ name: '', amount: '', dv: '' });

const saveToAWS = async () => {
  if (!state.product.quote) return alert("Quote ID required");
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
    if (res.ok) alert("Quote Saved to DynamoDB");
  } catch (e) { alert("Save Failed"); }
};

const loadFromAWS = async () => {
  const id = prompt("Quote ID:");
  if (!id) return;
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();    
    if (data) Object.assign(state, data);
    else alert("Not Found");
  } catch (e) { alert("Load Failed"); }
};
</script>