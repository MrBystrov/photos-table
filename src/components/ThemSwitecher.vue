<template>
    <button @click="toggleTheme"
        class="p-4 bg-blue-500 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 active:bg-blue-700">
        {{ currentTheme === 'light' ? 'Switch to dark' : 'Switch to light' }}
    </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

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

<style scoped>
.content {
    padding: 20px;
    text-align: center;
}

button {
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    color: var(--text-color-light);
    border: 1px solid var(--background-color-dark);
}

</style>
