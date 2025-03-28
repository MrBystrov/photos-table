<template>
    <button @click="toggleTheme"
        class="border-none cursor-pointer rounded-full  transition hover:shadow-yellow-400/50 hover:shadow-[0_0_15px_10px_rgba(0,0,0,0.3)]  active:bg-yellow-200">
        <Sun v-if=" currentTheme==='light'" class="w-12 h-12 text-[var(--text-color-light)]" />
        <Moon v-else class="w-12 h-12 text-[var(--text-color-light)]" />
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Sun, Moon } from "lucide-vue-next";

const currentTheme = ref('light');

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    updateTheme(currentTheme.value);
};

const updateTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('color-theme', theme);  
};

onMounted(() => {
    const savedTheme = localStorage.getItem('color-theme');
    if (savedTheme) {
        currentTheme.value = savedTheme;
    }
    updateTheme(currentTheme.value);
});
</script>

<style scoped></style>
