<template>
  <v-card>
    <v-toolbar
      color="secondary"
      dark
      flat
      dense
    >
      <v-toolbar-title> {{ t('administration.apikey.title') }} </v-toolbar-title>
      <v-spacer />
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-file-import"
            @click.stop="importDialogVisible = true"
          />
        </template>
        {{ t("administration.apikey.import") }}
      </v-tooltip>
      <AdministrationApikeyImportDialog
        v-model="importDialogVisible"
        @imported="getApiKeys()"
        @closed="importDialogVisible = false"
      />
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-export-variant"
            @click.stop="exportDialogVisible = true"
          />
        </template>
        {{ t("administration.apikey.export") }}
      </v-tooltip>
      <AdministrationApikeyExportDialog
        v-model="exportDialogVisible"
        :apiKeys="apiKeys"
        @created="getApiKeys()"
        @closed="exportDialogVisible = false"
      />
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-plus"
            @click.stop="createDialogVisible = true"
          />
        </template>
        {{ t("administration.apikey.create") }}
      </v-tooltip>
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-reload"
            :disabled="loading"
            @click.stop="getApiKeys()"
          />
        </template>
        {{ t("administration.apikey.reload") }}
      </v-tooltip>
    </v-toolbar>
    <AdministrationApikeySearchBar
      v-model="searchValue"
      @update:model-value="updateSearchValue"
    />
    <v-row
      v-if="loading"
      align="center"
      justify="center"
      class="ma-2"
    >
      <Loader />
    </v-row>
    <NoData
      v-else-if="!apiKeysFiltered || apiKeysFiltered.length === 0"
      :text="t('administration.apikey.noApikeys')"
    />
    <v-row
      v-else
      class="ma-2"
    >
      <v-col
        v-for="(key) in apiKeysFiltered"
        :key="key.apikey"
        cols="12"
        sm="12"
        md="12"
        lg="6"
        xl="6"
      >
        <AdministrationApikeyCard
          :apikey="key.apikey"
          :config="key.config"
          @click:delete="openDeleteDialog(key.apikey)"
          @click:update="openUpdateDialog(key.apikey)"
        />
      </v-col>
    </v-row>
    <AdministrationApikeyUpdateDialog
      v-model="updateDialogVisible"
      v-model:apikey="selectedApikey"
      v-model:configApiKey="selectedConfigApiKey"
      @updated="getApiKeys()"
      @closed="updateDialogVisible = false"
    />
    <AdministrationApikeyCreateDialog
      v-model="createDialogVisible"
      @created="getApiKeys()"
      @closed="createDialogVisible = false"
    />
  </v-card>
</template>

<script setup>

import { storeToRefs } from 'pinia';

const adminStore = useAdminStore();
const { password } = storeToRefs(adminStore);

const snackStore = useSnacksStore();

const { openConfirm } = useDialogStore();

const { t } = useI18n();
const { $fetch } = useNuxtApp();

const loading = ref(false);

const searchValue = ref('');

const createDialogVisible = ref(false);
const updateDialogVisible = ref(false);
const importDialogVisible = ref(false);
const exportDialogVisible = ref(false);

const selectedApikey = ref('');
const selectedConfigApiKey = ref({});

const apiKeys = ref([]);

const apiKeysFiltered = computed(() => {
  let filteredAPIkeys = apiKeys.value;
  if (searchValue.value) {
    filteredAPIkeys = apiKeys.value.filter(
      (key) => key.config.name.includes(searchValue.value)
    );
    return filteredAPIkeys;
  }
  return apiKeys.value;
});

async function getApiKeys() {
  loading.value = true;
  let data;
  try {
    data = await $fetch('/apikeys/', {
      method: 'GET',
      headers: {
        'x-api-key': password.value
      }
    });
  } catch (err) {
    snackStore.error(t('error.apikey.get'));
    loading.value = false;
    return;
  }
  loading.value = false;
  apiKeys.value = data;
}

async function openUpdateDialog(id) {
  const apikey = apiKeys.value.find((e) => e.apikey === id);
  selectedApikey.value = id;
  selectedConfigApiKey.value = apikey.config;
  await nextTick();
  updateDialogVisible.value = true;
}

async function deleteApiKey(apiKey) {
  loading.value = true;
  try {
    await $fetch(`/apikeys/${apiKey}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': password.value
      }
    });
  } catch (err) {
    snackStore.error(t('error.apikey.get'));
    loading.value = false;
    return;
  }
  loading.value = false;
}

async function openDeleteDialog(apiKey) {
  openConfirm({
    title: t('administration.apikey.delete'),
    text: t('administration.apikey.deleteMessage', { apiKey }) ,
    agreeText: t('delete'),
    agreeIcon: 'mdi-delete',
    onAgree: async () => {
      await deleteApiKey(apiKey)
      await getApiKeys();
    },
  });
}

function updateSearchValue(newValue) {
  searchValue.value = newValue;
}

onMounted(() => {
  getApiKeys();
});

</script>
