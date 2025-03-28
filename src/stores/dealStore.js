import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import { formatUserNameById } from "@/helpers/formatUserNameById";
import { formatDate } from "@/helpers/formatDate";
import { formatCurrency } from "@/helpers/formatCurrency";
import { correctEntityName } from "@/helpers/correctEntityName";

export const useDealStore = defineStore("dealStore", () => {
  const BASE_URL = "https://dveri-bambit.bitrix24.ru/rest/80";
  const entities = ref([]);
  const isLoading = ref(false);
  const isLoadingTitles = ref(false);
  const page = ref(1);
  const hasMore = ref(true);
  const minId = ref(2);
  const maxId = ref(23560);

  const allTitles = ref([]);
  const filtredTitles = ref([]);

  const allDeals = ref([])
  const allUsers = ref([]) 
  const allStages = ref([]);
    const stagesCodes = {
      P: "Промежуточная стадия",
      S: "Успешная стадия",
      F: "Провальная стадия",
    };

  const colorsByKey = ref({})

  const fullCorrectedDeals = computed(() => {
    if (!allUsers.value.length) return [];
    const deals = allDeals.value.map((item) => {
      return {
        ID: item.ID,
        TITLE: item.TITLE,
        STAGE_SEMANTIC_ID: stagesCodes[item.STAGE_SEMANTIC_ID],
        STAGE_ID: correctEntityName(item.STAGE_ID, allStages.value),
        ASSIGNED_BY_ID: formatUserNameById(item.ASSIGNED_BY_ID, allUsers.value),
        DATE_CREATE: formatDate(item.DATE_CREATE),
        CLOSEDATE: formatDate(item.CLOSEDATE),
        CREATED_BY_ID: formatUserNameById(item.CREATED_BY_ID, allUsers.value),
        CATEGORY_ID: item.CATEGORY_ID,
        CURRENCY_ID: item.CURRENCY_ID,
        OPPORTUNITY: formatCurrency(item.OPPORTUNITY),
        SOURCE_ID: correctEntityName(item.SOURCE_ID, allStages.value),
        UTM_SOURCE: item.UTM_SOURCE,
      };
    })
    return deals
  })

  const allowedTitles = [
    "ID",
    "TITLE",
    "STAGE_SEMANTIC_ID",
    "STAGE_ID",
    "ASSIGNED_BY_ID",
    "DATE_CREATE",
    "CREATED_BY_ID",
    "CATEGORY_ID",
    "CURRENCY_ID",
    "OPPORTUNITY",
    "CLOSEDATE",
    "SOURCE_ID",
    "UTM_SOURCE",
    "LEAD_ID",
  ];

  const fetchTableFields = async () => {
    try {
      isLoadingTitles.value = true;
      const response = await axios.get(
        `${BASE_URL}/3e7e3qrnoi3fo818/crm.deal.fields.json`
      );
      if (response.data) {
        allTitles.value = response.data.result;
        filtredTitles.value = Object.fromEntries(
          Object.keys(allTitles.value)
            .filter((key) => allowedTitles.includes(key))
            .map((key) => [key, allTitles.value[key].title])
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      isLoadingTitles.value = false;
    }
  };

  const fetchStages = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/94xsxq9qxbd1vh7f/crm.status.list.json `
      );
      if (response.data) {
        allStages.value = response.data.result;       
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/yr0vrgpfvlyc2l66/user.get.json `
      );
      if (response.data) {
        allUsers.value = response.data.result;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllDeals = async (at, to) => {
    allDeals.value = [];
    isLoading.value = true;
    try {
      const response = await axios.get(
        `${BASE_URL}/hzb15sdx7tu5jsph/crm.deal.list.json?filter[>ID]=${at}&filter[<ID]=${to}&select[0]=ID&select[1]=TITLE&select[2]=STAGE_SEMANTIC_ID&select[3]=STAGE_ID&select[4]=ASSIGNED_BY_ID&select[5]=DATE_CREATE&select[6]=CREATED_BY_ID&select[7]=CATEGORY_ID&select[8]=CURRENCY_ID&select[9]=OPPORTUNITY&select[10]=CLOSEDATE&select[11]=SOURCE_ID&select[12]=UTM_SOURCE&select[13]=LEAD_ID}`
      );

      if(response.data){
        allDeals.value = response.data.result
      }

    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const loadMore = () => {
   
  };

  return {
    isLoading,
    page,
    hasMore,
    minId,
    maxId,
    entities,
    fetchTableFields,
    filtredTitles,
    isLoadingTitles,
    fetchStages,
    fetchUsers,
    fetchAllDeals,
    allDeals,
    allUsers,
    allStages,
    stagesCodes,
    fullCorrectedDeals,
    colorsByKey,
  };
});
