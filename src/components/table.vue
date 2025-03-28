

            <template>
    <div ref="scrollContainer" class="overflow-auto relative border border-gray-400 w-full h-[calc(100%-300px)]"
        v-infinite-scroll="loadMore" :infinite-scroll-disabled="isLoading || !hasMore || isSorting || isInitialLoad"
        infinite-scroll-distance="10">
        <table class="min-w-full table-auto border-collapse border border-gray-400">
            <thead v-if="isLoadingTitles" class="table-header sticky top-0 shadow-md z-10 bg-blue-500">
                <th v-for="(title, key) in filtredTitles" :key="key"
                    class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition text-xs"
                    @click="sortTable(key)"
                    :class="{ 'bg-blue-300': sortColumn === key, 'bg-blue-200': sortColumn === key && sortDirection === -1 }">
                    <div class="h-6 w-12 bg-gray-300 animate-pulse rounded"></div>
                </th>
            </thead>
            <thead v-else class="table-header sticky top-0 shadow-md z-10 bg-blue-500">
                <th v-for="(title, key) in filtredTitles" :key="key"
                    class="cursor-pointer p-2 text-center border border-gray-300 hover:bg-blue-400 transition text-xs"
                    @click="sortTable(key)"
                    :class="{ 'bg-blue-300': sortColumn === key, 'bg-blue-200': sortColumn === key && sortDirection === -1 }">
                    {{ title }}
                </th>
            </thead>

            <tbody v-if="fullCorrectedDeals.length">
                <tr v-for="deal in fullCorrectedDeals" :key="deal.ID" class="border-b border border-gray-300">
                    <td v-for="(title, key) in filtredTitles" :key="key" :title="deal[key]"
                        class="p-2 text-center align-middle max-w-xs truncate border border-gray-300 truncate max-w-[160px]">
                        <div>{{ deal[key] }}</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <tbody v-if="isLoading">
                <tr v-for="n in 7" :key="n" class="border-b">
                    <td v-for="(value, key) in filtredTitles" :key="key" class="p-2 text-center">
                        <div class="h-6 w-12 bg-gray-300 animate-pulse rounded"></div>
                    </td>
                </tr>
            </tbody>
        <p v-if="!fullCorrectedDeals.length && !isLoading"
            class="p-2 font-semibold empty-text ml-[50%] absolute transform-[translate(-50%, 100px)];">
            Список пуст
        </p>
    </div>
</template>

<script setup>
import { useDealStore } from '@/stores/dealStore';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onBeforeMount } from 'vue';
import { formatDate } from '@/helpers/formatDate';
import { formatCurrency } from '@/helpers/formatCurrency';

const dealStore = useDealStore();
const { fetchTableFields, fetchStages, fetchUsers, fetchAllDeals } = dealStore;
const { filtredTitles, isLoadingTitles, allDeals, isLoading, fullCorrectedDeals } = storeToRefs(dealStore);
const sortColumn = ref('ID');
const sortDirection = ref(1);
const isSorting = ref(false);

const sortTable = (column) => {
    isSorting.value = true;

    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 1 ? -1 : 1;
    } else {
        sortColumn.value = column;
        sortDirection.value = 1;
    }

    dealStore.allDeals.sort((a, b) => {
        let aValue = a[column] ?? ""; 
        let bValue = b[column] ?? "";

        if (aValue === "" && bValue !== "") return 1;
        if (bValue === "" && aValue !== "") return -1;

        if (column === "ID" || column === "OPPORTUNITY") {
            return (Number(aValue) - Number(bValue)) * sortDirection.value;
        } else if (column === "DATE_CREATE" || column === "CLOSEDATE") {
            const parseDateParts = (date) => {
                if (typeof date === "string" && date.includes(".")) {
                    const [day, month, year] = date.split(".").map(Number);
                    return { year, month, day };
                }
                const d = new Date(date);
                return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
            };

            const dateA = parseDateParts(aValue);
            const dateB = parseDateParts(bValue);

            if (dateA.year !== dateB.year) {
                return (dateA.year - dateB.year) * sortDirection.value;
            }
            if (dateA.month !== dateB.month) {
                return (dateA.month - dateB.month) * sortDirection.value;
            }
            return (dateA.day - dateB.day) * sortDirection.value;
        } else {
            return String(aValue).localeCompare(String(bValue)) * sortDirection.value;
        }
    });

    isSorting.value = false;
};

onBeforeMount(async () => {
    await fetchUsers();
    await fetchStages();
});

onMounted(async () => {
    await fetchTableFields();
    await fetchAllDeals(1, 23560);
});
</script>
