<template>
    <div class="p-4 flex items-center justify-between">
        <div class="search-group flex gap-2">
            <input v-model="query" type="text" placeholder="Введите ID альбомов через пробел"
                class="p-2 border rounded placeholder:text-[12px] w-[300px]" />
            <button @click="onSearch" :disabled="isLoading"
                class="ml-2 p-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition disabled:cursor-not-allowed disabled:bg-blue-300">
                Поиск
            </button>
        </div>
        <ThemSwitecher />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePhotoStore } from '@/stores/photoStore';
import ThemSwitecher from './ThemSwitecher.vue';
import { storeToRefs } from 'pinia';

const query = ref('');
const photoStore = usePhotoStore();
const { photos } = storeToRefs(photoStore)

const onSearch = () => {
    photos.value = []
    console.log(photos.value); 
    photoStore.setSearchQuery(query.value);
};
</script>