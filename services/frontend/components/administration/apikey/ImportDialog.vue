<template>
  <v-dialog
    :value="value"
    max-width="1000px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ t('administration.apikey.import') }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" @click="emit('update:modelValue', false)"/>
      </v-toolbar>
      <v-card-text>
        <v-textarea
          v-model="apiKeys"
          outlined
          rows="15"
          label="apiKeys"
          :value="apiKeys"
          class="mt-4"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click.stop="loadApiKeys()">
          {{ t('send') }}
        </v-btn>
        <v-btn @click.stop="emit('update:modelValue', false)">
          {{ t('close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

import { storeToRefs } from 'pinia';

const { t } = useI18n();
const snackStore = useSnacksStore();
const adminStore = useAdminStore();
const { $apikey } = useNuxtApp();

const { password } = storeToRefs(adminStore);

const emit = defineEmits({
  'update:modelValue': () => true,
  imported: () => true,
});

const value = ref(false);
const apiKeys = ref([]);
const loading = ref(false);

async function loadApiKeys() {
  let parsedApiKeys;
  try {
    parsedApiKeys = JSON.parse(apiKeys.value);
  } catch (err) {
    snackStore.error(t('error.apikey.parse'));
    return;
  }

  loading.value = true;

  try {
    await $apikey({
      method: 'POST',
      url: '/keys/load',
      data: parsedApiKeys,
      headers: {
        'X-API-KEY': password.value,
      },
    });
  } catch (err) {
    snackStore.error(t('error.apikey.import'));
    loading.value = false;
    return;
  }
  snackStore.info(t('info.apikey.imported'));
  emit('imported');
  loading.value = false;
  emit('update:modelValue', false);
}

</script>
