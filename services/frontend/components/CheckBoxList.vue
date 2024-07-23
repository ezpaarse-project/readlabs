<template>
  <div>
    <v-card-actions>
      <v-btn
        variant="tonal"
        @click.stop="checkAll"
      > 
      <span> {{ t("checkAll") }} </span>
    </v-btn>
    <v-spacer />
      <v-btn
        variant="tonal"
        @click.stop="uncheckAll"
      >
        <span> {{ t("uncheckAll") }} </span>
      </v-btn>
    </v-card-actions>
    <v-checkbox 
      v-for="item in items"
      v-model="localSelected"
      :label="item"
      :value="item"
      :key="item"
    />
  </div>
</template>

<script setup>

const { t } = useI18n();

const props = defineProps({
  value: { type: Array, default: () => [] },
});


const emit = defineEmits(['update:value']);

const localSelected = ref([...props.value]);

onMounted(() => {
  if (props.value.includes('*')) {
    checkAll();
  }
});

watch(localSelected, (newValue) => {
  emit('update:value', newValue);
});

const checkAll = () => {
  localSelected.value = items.value;
  emit('update:value', items.value);
};

const uncheckAll = () => {
  localSelected.value = [];
  emit('update:value', items.value);
};

const items = ref([
  "categorieStructure",
  "codeUnite",
  "dateCreation",
  "delegationRegionaleCode",
  "delegationRegionaleLibelle",
  "dernierEtablissementRattachementDateFinValidite",
  "dernierEtablissementRattachementLibelle",
  "derniereImplantationDelegationRegionaleCode",
  "derniereImplantationDelegationRegionaleLibelle",
  "derniereImplantationEtablissement.Voie",
  "derniereImplantationEtablissement.boitePostale",
  "derniereImplantationEtablissement.codePostalEtranger",
  "derniereImplantationEtablissement.communeEtrangere",
  "derniereImplantationEtablissement.communeFrancaise.codePostal",
  "derniereImplantationEtablissement.communeFrancaise.commune",
  "derniereImplantationEtablissement.communeFrancaise.idReseda",
  "derniereImplantationEtablissement.communeFrancaise.libelleAcheminement",
  "derniereImplantationEtablissement.communeFrancaise.ligne5Hexaposte",
  "derniereImplantationEtablissement.complementAdresse",
  "derniereImplantationEtablissement.courrielContactWeb",
  "derniereImplantationEtablissement.delegationRegionale.code",
  "derniereImplantationEtablissement.delegationRegionale.idReseda",
  "derniereImplantationEtablissement.delegationRegionale.libelle",
  "derniereImplantationEtablissement.departement.code",
  "derniereImplantationEtablissement.departement.idReseda",
  "derniereImplantationEtablissement.departement.libelle",
  "derniereImplantationEtablissement.etablissementImplantation.code",
  "derniereImplantationEtablissement.etablissementImplantation.idReseda",
  "derniereImplantationEtablissement.etablissementImplantation.libelle",
  "derniereImplantationEtablissement.idOldImplantation",
  "derniereImplantationEtablissement.infrastructure.code",
  "derniereImplantationEtablissement.infrastructure.idReseda",
  "derniereImplantationEtablissement.infrastructure.libelle",
  "derniereImplantationEtablissement.numOrdre",
  "derniereImplantationEtablissement.numVoie",
  "derniereImplantationEtablissement.pays.codeIso2",
  "derniereImplantationEtablissement.pays.codeIso3",
  "derniereImplantationEtablissement.pays.idReseda",
  "derniereImplantationEtablissement.pays.libelle",
  "derniereImplantationEtablissement.region.code",
  "derniereImplantationEtablissement.region.idReseda",
  "derniereImplantationEtablissement.region.libelle",
  "derniereImplantationEtablissement.sHON",
  "derniereImplantationEtablissement.site.code",
  "derniereImplantationEtablissement.site.idReseda",
  "derniereImplantationEtablissement.site.libelle",
  "derniereImplantationEtablissement.sncMere",
  "derniereImplantationEtablissement.surfaceUtile",
  "derniereImplantations",
  "derniereImplantationsCodeEmplacement",
  "derniereImplantationsCodeEmplacementLibelle",
  "derniereImplantationsCodeStructure",
  "derniereImplantationsCodeUnite",
  "derniereImplantationsDateDebut",
  "derniereImplantationsDateFin",
  "derniereImplantationsInstitutRattachementLibelle",
  "derniereImplantationsLibelle",
  "effectifUnite",
  "etatStructure",
  "ezMetaDate",
  "idReseda",
  "intituleUnite",
  "numeroUnite",
  "personnels.code",
  "personnels.libelle",
  "personnels.total",
  "personnels_APPR",
  "personnels_A_MODIFIER",
  "personnels_CH",
  "personnels_DOCT",
  "personnels_ENS_CH",
  "personnels_IT",
  "personnels_POST_DOCT",
  "personnels_STAG_ETUD",
  "personnels_VACAT",
  "sigleUnite",
  "typeUniteCode",
  "typeUniteLibelle"
]);

const subItems = computed(() => ({
  "categorieStructure": "todo",
  "codeUnite": "todo",
  "dateCreation": "todo",
  "delegationRegionaleCode": "todo",
  "delegationRegionaleLibelle": "todo",
  "dernierEtablissementRattachementDateFinValidite": "todo",
  "dernierEtablissementRattachementLibelle": "todo",
  "derniereImplantationDelegationRegionaleCode": "todo",
  "derniereImplantationDelegationRegionaleLibelle": "todo",
  "derniereImplantationEtablissement.Voie": "todo",
  "derniereImplantationEtablissement.boitePostale": "todo",
  "derniereImplantationEtablissement.codePostalEtranger": "todo",
  "derniereImplantationEtablissement.communeEtrangere": "todo",
  "derniereImplantationEtablissement.communeFrancaise.codePostal": "todo",
  "derniereImplantationEtablissement.communeFrancaise.commune": "todo",
  "derniereImplantationEtablissement.communeFrancaise.idReseda": "todo",
  "derniereImplantationEtablissement.communeFrancaise.libelleAcheminement": "todo",
  "derniereImplantationEtablissement.communeFrancaise.ligne5Hexaposte": "todo",
  "derniereImplantationEtablissement.complementAdresse": "todo",
  "derniereImplantationEtablissement.courrielContactWeb": "todo",
  "derniereImplantationEtablissement.delegationRegionale.code": "todo",
  "derniereImplantationEtablissement.delegationRegionale.idReseda": "todo",
  "derniereImplantationEtablissement.delegationRegionale.libelle": "todo",
  "derniereImplantationEtablissement.departement.code": "todo",
  "derniereImplantationEtablissement.departement.idReseda": "todo",
  "derniereImplantationEtablissement.departement.libelle": "todo",
  "derniereImplantationEtablissement.etablissementImplantation.code": "todo",
  "derniereImplantationEtablissement.etablissementImplantation.idReseda": "todo",
  "derniereImplantationEtablissement.etablissementImplantation.libelle": "todo",
  "derniereImplantationEtablissement.idOldImplantation": "todo",
  "derniereImplantationEtablissement.infrastructure.code": "todo",
  "derniereImplantationEtablissement.infrastructure.idReseda": "todo",
  "derniereImplantationEtablissement.infrastructure.libelle": "todo",
  "derniereImplantationEtablissement.numOrdre": "todo",
  "derniereImplantationEtablissement.numVoie": "todo",
  "derniereImplantationEtablissement.pays.codeIso2": "todo",
  "derniereImplantationEtablissement.pays.codeIso3": "todo",
  "derniereImplantationEtablissement.pays.idReseda": "todo",
  "derniereImplantationEtablissement.pays.libelle": "todo",
  "derniereImplantationEtablissement.region.code": "todo",
  "derniereImplantationEtablissement.region.idReseda": "todo",
  "derniereImplantationEtablissement.region.libelle": "todo",
  "derniereImplantationEtablissement.sHON": "todo",
  "derniereImplantationEtablissement.site.code": "todo",
  "derniereImplantationEtablissement.site.idReseda": "todo",
  "derniereImplantationEtablissement.site.libelle": "todo",
  "derniereImplantationEtablissement.sncMere": "todo",
  "derniereImplantationEtablissement.surfaceUtile": "todo",
  "derniereImplantations": "todo",
  "derniereImplantationsCodeEmplacement": "todo",
  "derniereImplantationsCodeEmplacementLibelle": "todo",
  "derniereImplantationsCodeStructure": "todo",
  "derniereImplantationsCodeUnite": "todo",
  "derniereImplantationsDateDebut": "todo",
  "derniereImplantationsDateFin": "todo",
  "derniereImplantationsInstitutRattachementLibelle": "todo",
  "derniereImplantationsLibelle": "todo",
  "effectifUnite": "todo",
  "etatStructure": "todo",
  "ezMetaDate": "todo",
  "idReseda": "todo",
  "intituleUnite": "todo",
  "numeroUnite": "todo",
  "personnels.code": "todo",
  "personnels.libelle": "todo",
  "personnels.total": "todo",
  "personnels_APPR": "todo",
  "personnels_A_MODIFIER": "todo",
  "personnels_CH": "todo",
  "personnels_DOCT": "todo",
  "personnels_ENS_CH": "todo",
  "personnels_IT": "todo",
  "personnels_POST_DOCT": "todo",
  "personnels_STAG_ETUD": "todo",
  "personnels_VACAT": "todo",
  "sigleUnite": "todo",
  "typeUniteCode": "todo",
  "typeUniteLibelle": "todo",
}));

</script>
