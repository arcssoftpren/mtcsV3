<template>
  <div class="d-flex justify-center align-center flex-column">
    <v-btn-toggle
      class="ma-auto"
      density="compact"
      variant="outlined"
      rounded="pill"
      block
      mandatory
      v-if="inspection.selectedLogic.inputType == 'button'"
      v-model="inspectionValue"
      @change="$emit('update', inspection.selectedLogic.value)"
    >
      <v-btn color="success" value="OK">OK</v-btn>
      <v-btn value="NG" color="error">NG</v-btn>
    </v-btn-toggle>
    <v-text-field
      class="ma-auto"
      width="150px"
      v-else
      variant="outlined"
      rounded="pill"
      density="compact"
      hide-details
      hide-spin-buttons
      v-model="inspectionValue"
    >
      <template #append-inner v-if="unit">
        <span class="mr-2">{{ unit }}</span>
      </template>
    </v-text-field>
  </div>
</template>
<script setup>
const props = defineProps(['logic', 'standards', 'unit']);
const emit = defineEmits(['update']);
import { inspectionHelper } from '@/assets/js/helper';
const inspection = ref(new inspectionHelper());
inspection.value.setId(props.logic);
inspection.value.standards = props.standards || [];
const inspectionValue = ref('');
const judgement = ref(null);

watch(inspectionValue, () => {
  judgement.value = inspection.value.calculate(inspectionValue.value);
  emit('update', { value: inspectionValue.value, judgement: judgement.value });
});
</script>
