<template>
  <v-dialog
    :value="value"
    max-width="1000px"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ t('administration.apikey.create') }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" @click="emit('update:modelValue', false)"/>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-form
          id="formCreate"
          v-model="validForm"
          @submit.prevent="createApikey()"
        >
          <v-text-field
            v-model="configApiKey.name"
            :rules="nameRule"
            :label="t('administration.apikey.name')"
            name="name"
            outlined
            clearable
            required
            autofocus
          />
          <v-text-field
            v-model="configApiKey.owner"
            :label="t('administration.apikey.owner')"
            name="owner"
            outlined
            clearable
            required
          />
          <v-text-field
            v-model="configApiKey.description"
            :label="t('administration.apikey.description')"
            name="description"
            outlined
            clearable
            required
          />
          <v-divider />
          <CheckBoxList :value="configApiKey.attributes" @update:value="handleAttributesUpdate" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="tonal"
          @click.stop="emit('update:modelValue', false)"
        >
          {{ t('cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          variant="tonal"
          type="submit"
          form="formCreate"
          :disabled="!validForm"
          :loading="loading"
        >
          {{ t('create') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

import { storeToRefs } from 'pinia';
const adminStore = useAdminStore();
const { password } = storeToRefs(adminStore);

const snackStore = useSnacksStore();

const { t } = useI18n();
const { $fetch } = useNuxtApp();

// Value of dialog
const value = ref(false);

const loading = ref(false);

const emit = defineEmits({
  'update:modelValue': () => true,
  created: () => true,
});

const configApiKey = ref({
  name: '',
  owner: '',
  description: '',
  allowed: true,
  attributes: [],
});

const nameRule = computed(() => [(v) => !!v || t('required')]);

const validForm = computed(() => configApiKey.value.attributes.length > 0
  && configApiKey.value.name.length > 0);

async function createApikey() {
  loading.value = true;
  try {
    await $fetch('/apikeys', {
      method: 'POST',
      body: {
        name: configApiKey.value.name,
        owner: configApiKey.value.owner,
        description: configApiKey.value.description,
        attributes: configApiKey.value.attributes,
        allowed: configApiKey.value.allowed,
      },
      headers: {
        'x-api-key': password.value
      }
    });
  } catch (err) {
    snackStore.error(t('error.apikey.create'));
    loading.value = false;
    return;
  }
  snackStore.info(t('info.apikey.created'));
  emit('created');
  loading.value = false;
  emit('update:modelValue', false);
}

function handleAttributesUpdate(newAttributes) {
  configApiKey.value.attributes = newAttributes;
}

</script>