<template>
<div ref="scrollContainer" class="overflow-auto relative border border-gray-400"
    style="height: 600px; width: 600px;" 
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="isLoading || !hasMore || isSorting || isInitialLoad"
    infinite-scroll-distance="10">
        <table class="min-w-full table-auto border-collapse border border-gray-400">
            <thead class="table-header sticky top-0 shadow-md z-10 bg-blue-500">
                <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                    @click="sortTable('id')"
                    :class="{ 'bg-blue-300': sortColumn === 'id', 'bg-blue-200': sortColumn === 'id' && sortDirection === -1 }">
                    ID
                </th>
                <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                    @click="sortTable('albumId')"
                    :class="{ 'bg-blue-300': sortColumn === 'albumId', 'bg-blue-200': sortColumn === 'albumId' && sortDirection === -1 }">
                    Альбом
                </th>
                <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                    @click="sortTable('title')"
                    :class="{ 'bg-blue-300': sortColumn === 'title', 'bg-blue-200': sortColumn === 'title' && sortDirection === -1 }">
                    Название
                </th>
                <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                    @click="sortTable('url')"
                    :class="{ 'bg-blue-300': sortColumn === 'url', 'bg-blue-200': sortColumn === 'url' && sortDirection === -1 }">
                    Ссылка
                </th>
                <th class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition"
                    @click="sortTable('thumbnailUrl')"
                    :class="{ 'bg-blue-300': sortColumn === 'thumbnailUrl', 'bg-blue-200': sortColumn === 'thumbnailUrl' && sortDirection === -1 }">
                    Миниатюра
                </th>
            </thead>

            <tbody v-if="photos.length">
                <tr v-for="photo in photos" :key="photo.id" class="border-b border border-gray-300">
                    <td class="p-2 text-center align-middle max-w-xs truncate border border-gray-300">{{ photo.id }}
                    </td>
                    <td class="p-2 text-center align-middle max-w-xs truncate border border-gray-300">{{ photo.albumId
                        }}</td>
                    <td class="p-2 text-center align-middle text-cut border border-gray-300" :title="photo.title">{{
                        photo.title }}</td>
                    <td class="p-2 text-center align-middle text-cut border border-gray-300" :title="photo.url">{{
                        photo.url }}</td>
                    <td class="p-2 text-center align-middle border border-gray-300 flex justify-center items-center">
                        <LazyImage :src="photo.thumbnailUrl" alt="thumbnail" class="w-16 h-16 rounded-md" />
                    </td>
                </tr>
                <tr v-if="photos.length && isLoading">
                    <td colspan="5" class="text-center py-4">
                        <AppSpinner />
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
            Список фотографий пуст
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
const sortColumn = ref(null);
const sortDirection = ref(1);
const isSorting = ref(false); 

const scrollContainer = ref(null);

const sortTable = (column) => {
    isSorting.value = true;
    if (sortColumn.value === column) {
        sortDirection.value *= -1;
    } else {
        sortColumn.value = column;
        sortDirection.value = 1;
    }

    photoStore.photos.sort((a, b) => {
        if (a[column] < b[column]) return -1 * sortDirection.value;
        if (a[column] > b[column]) return 1 * sortDirection.value;
        return 0;
    });

    isSorting.value = false;
};

const loadMore = () => {
    console.log('ok');
    if (!isLoading.value && hasMore.value && !isSorting.value) {  
        photoStore.loadMore();
    }
};

onMounted(() => {
    useInfiniteScroll(scrollContainer, loadMore, { distance: 10 });
});

</script>

<style scoped>
.text-cut {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
}

.empty-text {
    margin-left: 50%;
    transform: translate(-50%, 100px);
}
</style>
