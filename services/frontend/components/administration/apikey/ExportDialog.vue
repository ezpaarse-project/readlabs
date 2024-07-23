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
          {{ t('administration.apikey.export') }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon="mdi-close" @click="emit('update:modelValue', false)"/>
      </v-toolbar>
      <v-card-text>
        <JSONView
          :code="apiKeysStringified"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <CopyButton :text="apiKeysStringified"/>
        <DownloadButton :text="apiKeysStringified"/>
        <v-btn @click.stop="emit('update:modelValue', false)">
          {{ t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>

const { t } = useI18n();

const value = ref(false);

const props = defineProps({
  apiKeys: { type: Array, default: () => [] },
});

const apiKeysStringified = computed(() => JSON.stringify(props.apiKeys, null, 2));

const emit = defineEmits({
  'update:modelValue': () => true,
});

</script>
