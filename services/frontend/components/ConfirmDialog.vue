<template>
  <v-dialog
    :model-value="dialogStore.show"
    max-width="1000"
    v-bind="$attrs"
    @update:model-value="cancel()"
  >
    <v-card>
    <v-toolbar
      color="primary"
      dark
    >
      <v-toolbar-title>
        {{ dialogStore.data.title }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-close" @click="cancel()"/>
    </v-toolbar>
    <v-card-text class="mt-4">
      {{  dialogStore.data.text  }}
    </v-card-text>
      <template #actions>
        <v-spacer />

        <v-btn
          :text="dialogStore.data.disagreeText || $t('cancel')"
          :prepend-icon="dialogStore.data.disagreeIcon"
          :disabled="agreeLoading"
          :loading="disagreeLoading"
          size="small"
          variant="tonal"
          @click="cancel()"
        />
        <v-btn
          :text="dialogStore.data.agreeText || $t('confirm')"
          :prepend-icon="dialogStore.data.agreeIcon"
          :disabled="disagreeLoading"
          :loading="agreeLoading"
          size="small"
          variant="tonal"
          @click="agree()"
        />
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>

const dialogStore = useDialogStore();

const disagreeLoading = ref(false);
const agreeLoading = ref(false);

async function cancel() {
  disagreeLoading.value = true;
  await dialogStore.data.onDisagree?.();
  dialogStore.closeConfirm(false);
  disagreeLoading.value = false;
}

async function agree() {
  agreeLoading.value = true;
  await dialogStore.data.onAgree?.();
  dialogStore.closeConfirm(true);
  agreeLoading.value = false;
}
</script>
