<template>
  <v-card>
    <v-card-title class="pt-5 pl-5 pr-5 ma-2">
      <v-row align="center">
        {{ config.name }}
        <v-spacer />
          <v-switch
            v-model="config.allowed"
            label="Allowed"
            color="green-darken-3"
            hide-details="true"
            @change="updateAllowed"
          />
      </v-row>
    </v-card-title>

    <v-card-subtitle class="pb-0">
      {{ props.apikey }}
    </v-card-subtitle>

    <v-divider class="ma-2" />

    <v-list>
      <v-list-item style="min-height: 16px">
        <v-icon class="mr-3">
          mdi-account-circle
        </v-icon>
        {{ t("administration.apikey.ownerValue", { owner: props.config.owner }) }}
      </v-list-item>
      <v-list-item style="min-height: 16px">
        <v-icon class="mr-3">
          mdi-text-account
        </v-icon>
        {{ t("administration.apikey.descriptionValue", { description: props.config.description }) }}
      </v-list-item>
      <v-list-item style="min-height: 16px">
        <v-icon class="mr-3">
          mdi-calendar-account-outline
        </v-icon>
        <span>
          {{ t("administration.apikey.createdAtValue", { date: props.config.createdAt }) }}
        </span>
      </v-list-item>
      <v-icon class="mr-3 ml-4">
        mdi-code-json
      </v-icon>
      <span> {{ t('administration.apikey.attributes') }} </span>
      <v-chip
        v-for="attribute in config.attributes"
        :key="attribute"
        color="green darken-3"
        text-color="white"
        class="ma-1"
        label
        small
      >
        {{ attribute }}
      </v-chip>
    </v-list>

    <v-divider class="mx-2" />

    <v-card-actions>
      <v-btn
        variant="tonal"
        @click.stop="emit('click:update', props.apikey);"
      >
        <span> {{ t("edit") }} </span>
      </v-btn>
      <v-spacer />
      <v-btn
        append-icon="mdi-delete"
        variant="tonal"
        @click.stop="emit('click:delete', props.apikey)"
      >
        <span> {{ t("delete") }} </span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>

import { storeToRefs } from 'pinia';
const adminStore = useAdminStore();
const { password } = storeToRefs(adminStore);
const snackStore = useSnacksStore();

const { t } = useI18n();
const { $fetch } = useNuxtApp();

const loading = ref(false);

const props = defineProps({
  apikey: { type: String, default: '' },
  config: { type: Object, default: () => {} },
});

const emit = defineEmits({
  'click:update': (apikey) => !!apikey,
  'click:delete': (apikey) => !!apikey,
});

async function updateAllowed() {
  loading.value = true;
  try {
    await $fetch(`/apikeys/${props.apikey}`, {
      method: 'PUT',
      body: {
        allowed: props.config.allowed
      },
      headers: {
        'x-api-key': password.value
      }
    });
  } catch (err) {
    snackStore.error(t('error.apikey.get'));
    return;
  } finally {
    loading.value = false;
  }
  snackStore.info(t('info.apikey.updated'));
}

</script>
