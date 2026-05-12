import axios from 'axios';
import { ref, unref } from 'vue';

const lambdaUrl = '';

export default function useOrderTabRec() {
    const loading = ref(false);
    const errors = ref(null);
    const successData = ref(null);

    const postOrderTabRec = async (payloadLike) => {
        loading.value = true;
        errors.value = null;
        try {
            const payload = unref(payloadLike);
            console.log(payload);
            // 1. Use the direct axios.post method
            // 2. Do NOT add a trailing slash if it's not in your AWS config
            const res = await axios.post(lambdaUrl, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(res?.data);
            successData.value = res.data;
            console.log('Success!', res.data);
            return res.data;
        } catch (err) {
            // This captures the CORS 'Network Error' or actual server errors
            errors.value = err.response?.data || err.message;
            console.error('Submission Error:', errors.value);
            throw err;
        } finally {
            loading.value = false;
        }
    };

    return { loading, errors, successData, postOrderTabRec };
}
