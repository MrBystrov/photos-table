<template>
    <div class="relative w-16 h-16 flex items-center justify-center">
        <div v-if="loading" class="absolute w-full h-full bg-gray-300 animate-pulse rounded-md"></div>

        <img v-if="!error" :src="src" :alt="alt" class="w-16 h-16 rounded-md transition-opacity duration-300"
            :class="{ 'opacity-0': loading }" @load="onLoad" @error="onError" loading="lazy" />

        <div v-if="error"
            class="absolute w-full h-full flex items-center justify-center bg-gray-200 rounded-md text-xs text-gray-500">
            ❌ Ошибка
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    src: String,
    alt: {
        type: String,
        default: 'Изображение'
    }
});

const loading = ref(true);
const error = ref(false);

const onLoad = () => {
    loading.value = false;
};

const onError = () => {
    console.error("Image failed to load.");
    loading.value = false;
    error.value = true;
};
</script>
