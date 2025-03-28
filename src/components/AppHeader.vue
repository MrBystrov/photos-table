<template>
    <div class="p-4 flex items-center justify-between">
        <div class="search-group flex gap-2 flex-col">
            <form class="w-full flex gap-4 items-center">
                <span class="font-semibold">Фильтр</span>
                <label class="search-label">
                    <span>Ид от</span>
                    <input v-model="minId" type="text"
                        class="search-input p-2 rounded transition hover:shadow-[0_0_5px_10px_rgba(0,0,0,0.3)] hover:shadow-yellow-500/50 focus:shadow-[0_0_5px_10px_rgba(0,0,0,0.3)] focus:shadow-yellow-500/50"
                        @input="validateMinId" />
                </label>
                <label class="search-label">
                    <span>Ид до</span>
                    <input v-model="maxId" type="text" :max="23560"
                        class="search-input p-2 rounded transition hover:shadow-[0_0_5px_10px_rgba(0,0,0,0.3)] hover:shadow-yellow-500/50 focus:shadow-[0_0_5px_10px_rgba(0,0,0,0.3)] focus:shadow-yellow-500/50"
                        @input="validateMaxId" />
                </label>
                <Button @click.prevent="onSearch" :disabled="isLoading"
                    class="ml-2 p-2 bg-blue-400 rounded cursor-pointer text-black gap-2 flex hover:bg-blue-300 transition active:bg-blue-200 disabled:cursor-not-allowed disabled:bg-blue-100">
                    <span>Поиск</span>
                    <Search />
                </Button>
            </form>
        </div>
        <ThemSwitecher />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDealStore } from '@/stores/dealStore';
import ThemSwitecher from './ThemSwitecher.vue';
import { storeToRefs } from 'pinia';
import { Search } from 'lucide-vue-next';

const query = ref('');
const dealStore = useDealStore();
const { fetchAllDeals } = dealStore;
const { minId, maxId } = storeToRefs(dealStore)

const MAX_ID = 23560;

const onSearch = () => {
    console.log('minmax', minId.value, maxId.value);
    if (minId.value === '') {
        minId.value = 1;
    }
    if (maxId.value === '') {
        maxId.value = MAX_ID;
    }
    fetchAllDeals(minId.value, maxId.value)
};


const validateMinId = () => {
    minId.value = minId.value.replace(/[^0-9]/g, '');

    if (parseInt(minId.value) > parseInt(maxId.value)) {
        minId.value = maxId.value;
    }
};

const validateMaxId = () => {
    maxId.value = maxId.value.replace(/[^0-9]/g, ''); 

    if (parseInt(maxId.value) < parseInt(minId.value)) {
        maxId.value = minId.value;
    }

    if (parseInt(maxId.value) > MAX_ID) {
        maxId.value = MAX_ID;
    }
};
</script>

<style scoped>
.search-input {
    @apply border placeholder:text-[12px] w-[300px];
}

.search-label {
    @apply flex gap-[5px] items-center;
}
</style>
