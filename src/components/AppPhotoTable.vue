<template>
    <div ref="scrollContainer" class="overflow-auto relative border border-gray-400 overflow-auto"
        style="height: 600px; width: 600px;" v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isLoading || !hasMore" infinite-scroll-distance="10">
        <table class="min-w-full table-auto border-collapse border border-gray-400">
            <thead class="table-header sticky top-0 shadow-md z-10 bg-blue-500">
                <tr>
                    <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                        @click="sortTable('id')">ID</th>
                    <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                        @click="sortTable('albumId')">Альбом</th>
                    <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                        @click="sortTable('title')">Название</th>
                    <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                        @click="sortTable('url')">Ссылка</th>
                    <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                        @click="sortTable('thumbnailUrl')">Миниатюра</th>
                </tr>
            </thead>

            <tbody v-if="photos.length">
                <tr v-for="photo in photos" :key="photo.id" class="border-b border border-gray-300">
                    <td class="p-2 text-center align-middle max-w-xs truncate border border-gray-300">{{ photo.id }}
                    </td>
                    <td class="p-2 text-center align-middle max-w-xs truncate border border-gray-300">{{ photo.albumId
                        }}</td>
                    <td class="p-2 text-center align-middle text-cut border border-gray-300" :title="photo.title">
                        {{ photo.title }}
                    </td>
                    <td class="p-2 text-center align-middle text-cut border border-gray-300" :title="photo.url">
                        {{ photo.url }}
                    </td>
                    <td class="p-2 text-center align-middle border border-gray-300 flex justify-center items-center">
                        <LazyImage :src="photo.thumbnailUrl" alt="thumbnail" class="w-16 h-16 rounded-md" />
                    </td>
                </tr>
            </tbody>

            <tbody v-if="isLoading && !photos.length">
                <tr v-for="n in 7" :key="n" class="border-b">
                    <td class="p-2 text-center">
                        <div class="h-6 w-12 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td class="p-2 text-center">
                        <div class="h-6 w-16 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td class="p-2 text-center">
                        <div class="h-6 w-40 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td class="p-2 text-center">
                        <div class="h-6 w-52 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                    <td class="p-2 text-center">
                        <div class="h-16 w-16 bg-gray-300 animate-pulse rounded-md"></div>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-if="!photos.length && !isLoading" class="p-2 font-semibold empty-text absolute">
            Список фотограффий пуст
        </p>
    </div>
</template>

<script setup>
import { usePhotoStore } from '@/stores/photoStore';
import { storeToRefs } from 'pinia';
import { useInfiniteScroll } from '@vueuse/core';
import { ref, onMounted } from 'vue';
import AppSpinner from './AppSpinner.vue';
import LazyImage from './LazyImage.vue';

const photoStore = usePhotoStore();
const { photos, isLoading, hasMore } = storeToRefs(photoStore);

const scrollContainer = ref(null);

const sortTable = (column) => {
    photoStore.photos.sort((a, b) => (a[column] > b[column] ? 1 : -1));
};

const loadMore = () => {
    if (!isLoading.value && hasMore.value) {
        photoStore.loadMore();
    }
};

const checkInitialScroll = () => {
    if (photos.value.length === 0 && !isLoading.value && hasMore.value) {
        photoStore.loadMore();
    }
};

onMounted(() => {
    useInfiniteScroll(scrollContainer, loadMore, { distance: 10 });
});

checkInitialScroll();
</script>

<style scoped>
.text-cut {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
}

.empty-text{

    margin-left: 50%;
    transform: translate(-50%, 100px);
}
</style>
