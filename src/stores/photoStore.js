import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const usePhotoStore = defineStore("photoStore", () => {
  const BASE_URL = "https://jsonplaceholder.typicode.com";
  const photos = ref([]);
  const isLoading = ref(false);
  const page = ref(1);
  const hasMore = ref(true);
  const searchQuery = ref("");

  const fetchPhotos = async (limit = 30) => {
    isLoading.value = true;
    try {
      let queryParams = new URLSearchParams();

      if (searchQuery.value.trim()) {
        const albumIds = searchQuery.value.trim().split(/\s+/);
        albumIds.forEach((id) => queryParams.append("albumId", id));
      }

      queryParams.append("_page", page.value.toString());
      queryParams.append("_limit", limit.toString()); // Устанавливаем лимит

      const response = await axios.get(
        `${BASE_URL}/photos?${queryParams.toString()}`
      );

      if (response.data.length === 0) {
        hasMore.value = false;
      }

      photos.value.push(...response.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = () => {
    if (hasMore.value) {
      page.value += 1;
      fetchPhotos(20); // Загружаем 20 строк при вызове loadMore
    }
  };

  const setSearchQuery = (query) => {
    console.log("okk");
    searchQuery.value = query;
    page.value = 1;
    photos.value = [];
    hasMore.value = true;
    fetchPhotos();
  };

  return {
    photos,
    isLoading,
    page,
    hasMore,
    searchQuery,
    fetchPhotos,
    loadMore,
    setSearchQuery,
  };
});
