<template>
  <section class="ma-3">
    <AdministrationApikeyTab v-if="isAdmin" class="my-4" />
  </section>
</template>

<script setup>

const adminStore = useAdminStore();

const isAdmin = computed(() => adminStore.isAdmin);

</script>
