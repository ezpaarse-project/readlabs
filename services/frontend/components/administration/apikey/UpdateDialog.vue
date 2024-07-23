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
          {{ t('administration.apikey.update') }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" @click="emit('update:modelValue', false)"/>
      </v-toolbar>
      <v-toolbar
        color="primary"
        dark
      >
        <v-toolbar-title>
          {{ props.apikey }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text class="mt-4">
        <v-form
          :id="`form-${props.apikey}`"
          v-model="validForm"
          @submit.prevent="updateApikey()"
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
          <check-box-list :value="props.configApiKey.attributes" @update:value="handleAttributesUpdate"/>
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
          :form="`form-${apikey}`"
          :disabled="!validForm && attributesRules"
          :loading="loading"
        >
          {{ t('update') }}
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

const value = ref(false);
const loading = ref(false);

const props = defineProps({
  apikey: { type: String, default: '' },
  configApiKey: { type: Object, default: () => {} },
});

const emit = defineEmits({
  'update:modelValue': () => true,
  'update:configApiKey': (val) => val,
  updated: () => true,
});

const configApiKey = computed({
  get: () => props.configApiKey,
  set: (val) => val,
})

const selectedAttribute = ref(configApiKey.value.attributes)

const nameRule = computed(() => [(v) => !!v || t('required')]);
const attributesRules = computed(() => selectedAttribute.value > 0);

const validForm = ref(false);

async function updateApikey() {
  loading.value = true;
  try {
    await $fetch(`/apikeys/${props.apikey}`, {
      method: 'PUT',
      body: {
        name: configApiKey.value.name,
        owner: configApiKey.value.owner,
        description: configApiKey.value.description,
        attributes: selectedAttribute.value,
      },
      headers: {
        'X-API-KEY': password.value,
      },
    });
  } catch (err) {
    snackStore.error(t('error.apikey.update'));
    loading.value = false;
    return;
  }
  snackStore.info(t('info.apikey.updated'));
  emit('updated');
  loading.value = false;
  emit('update:modelValue', false);
}

function handleAttributesUpdate(newAttributes) {
  selectedAttribute.value = newAttributes;
}

</script>
