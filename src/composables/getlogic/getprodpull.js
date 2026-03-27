import { useProductStore } from '@/stores/useProductStore';
import { useFetch } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

export default function useProduct() {
    const input = ref('');
    const errors = ref('');
    const results = ref([]);
    const productStore = useProductStore();

    // Make products a ref so you can replace it safely
    const products = ref([]);

    const url = computed(() => 'https://uqge54ic7ackf7z2yfckhhuh5m0vdmti.lambda-url.us-east-1.on.aws/');

    const {
        data,
        error: fetchError,
        isFetching,
        execute
    } = useFetch(url, {
        immediate: false,
        mode: 'cors',
        credentials: 'omit'
    })
        .get()
        .json();

    watch(data, (res) => {
        let payload = res;
        if (res?.body != null) {
            payload = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
        }

        productStore.addData(payload);
    });

    const fetchData = async () => {
        errors.value = '';
        await execute();
    };

    return {
        input,
        fetchData,
        errors,
        results,
        isFetching,
        productStore,
        products
    };
}
