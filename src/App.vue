<template>
  <div id="app">
    <AppHeader />
    <main class="items-center justify-center flex">
      <AppPhotoTable />
    </main>
  </div>
</template>


<script setup>
import { onMounted } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppPhotoTable from './components/AppPhotoTable.vue';
import { usePhotoStore } from './stores/photoStore';

const photoStore = usePhotoStore();
const { fetchPhotos } = photoStore;

onMounted(() => {
  fetchPhotos()
});
</script>

<style scoped>
  #app{
    background-color: var(--background-color-light);
    height: 100vh;
    color: var(--text-color-light);
  }
  main{
    display: flex;
    height: calc(100vh - 75px);
  }

</style>
