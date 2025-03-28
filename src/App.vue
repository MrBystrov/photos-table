<template>
  <div id="app">
    <AppHeader />
    <main class="p-8">
      <h1>Отчет по сделакам</h1>
      <AppPhotoTable />
    </main>
  </div>
</template>


<script setup>
import { onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppPhotoTable from './components/AppPhotoTable.vue';
import { useDealStore } from './stores/dealStore';

const photoStore = useDealStore();
const { fetchPhotos } = photoStore;


</script>

<style scoped>
  #app{
    @apply bg-[var(--background-color-light)] h-screen text-[var(--text-color-light)];
  
  }
  main{
    @apply flex flex-col items-center h-[calc(100vh-75px)];
  }

</style>
