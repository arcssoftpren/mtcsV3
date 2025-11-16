<template>
  <div class="py-2">
    <v-text-field
      variant="outlined"
      rounded="pill"
      density="compact"
      type="text"
      label="Label"
      v-model="formData.label"
      :error-messages="validate.label.$errors.map((e) => e.$message)"
    />
    <v-select
      class="mt-2"
      :items="structure.logic.items"
      variant="outlined"
      rounded="pill"
      density="compact"
      label="Logic"
      v-model="formData.logic"
      @update:model-value="setLogic($event)"
    />
    <div class="d-flex justify-center mb-2">
      <v-checkbox-btn v-model="unit" label="Use Unit"></v-checkbox-btn>

      <v-text-field
        hide-details
        label="Unit"
        variant="outlined"
        rounded="pill"
        density="compact"
        :disabled="!unit"
        v-model="formData.unit"
        :error-messages="validate.unit.$errors.map((e) => e.$message)"
      >
      </v-text-field>
    </div>
    <v-row>
      <v-col cols="12">
        <v-divider>Standard</v-divider>
      </v-col>
      <v-col
        :cols="12 / inspection.standards.length"
        v-for="(item, index) in inspection.standards"
        :key="index"
      >
        <v-text-field
          variant="outlined"
          rounded="pill"
          density="compact"
          hide-spin-buttons
          hide-details
          :type="inspection.selectedLogic.inputType"
          :label="item.label"
          v-model="inspection.standards[index]"
        >
          <template #prepend-inner>
            {{
              inspection.selectedLogic.operators
                ? inspection.selectedLogic.operators[index]
                : ''
            }}
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-btn
          :disabled="inspection.standards.includes('')"
          variant="outlined"
          rounded="pill"
          block
          @click="submit"
          >Submit</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { inspectionHelper } from '@/assets/js/helper';

const store = useAppStore();
const unit = ref(false);
const inspection = ref(new inspectionHelper());
inspection.value.setId(1);
const props = defineProps(['itemData']);
const emits = defineEmits(['submitted']);
const formData = reactive({
  label: '',
  logic: 1,
  unit: '',
});
const structure = reactive({
  label: {
    label: 'Label',
    type: 'text',
    hint: 'Enter the label for the inspection method',
  },
  logic: {
    label: 'Logic',
    type: 'select',
    hint: 'Select the logic for the inspection method',
    items: [],
  },
});
const rules = {
  label: { required: helpers.withMessage('Label is required', required) },
  logic: { required: helpers.withMessage('Logic is required', required) },
  unit: {
    required: helpers.withMessage('Unit is required', () => {
      if (unit.value) {
        return formData.unit.trim() !== '';
      } else {
        return true;
      }
    }),
  },
};
const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid) {
      throw {
        title: 'Validation Error',
        text: 'Please check the form for errors.',
        icon: 'error',
      };
    }

    const reqData = {
      insId: props.itemData.insId,
      label: formData.label,
      logic: formData.logic,
      unit: unit.value ? formData.unit : null,
      standard: JSON.stringify(inspection.value.standards),
    };
    await store.fetchData(reqData, '/inspections/methods', 'POST');
    emits('submitted');
  } catch (error) {
    store.myAlert.fire(error);
  }
};

const refresh = async () => {
  const res = await store.fetchData({}, '/inspections/logics');
  structure.logic.items = res.data.map((item) => ({
    title: item.label,
    value: item.id,
  }));
};

const setLogic = (id) => {
  inspection.value.setId(id);
};

onBeforeMount(() => {
  refresh();
});
</script>
