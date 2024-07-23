<template>
  <v-btn icon="mdi-content-copy" variant="plain" class="ma-0" @click="copyText()" />
</template>

<script setup>

const { t } = useI18n();

const props = defineProps({
  text: { type: String, default: '' },
});

const snackStore = useSnacksStore();

function unsecuredCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('display', 'none');
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
}

function copyText() {
  try {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(props.text);
    } else {
      unsecuredCopyToClipboard(props.text);
    }
  } catch (err) {
    snackStore.error(t('error.apikey.copy'));
    return;
  }
  snackStore.info(t('info.apikey.copied'));
}

</script>