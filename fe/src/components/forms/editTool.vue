<template>
  <div class="py-2">
    <div v-for="(item, index) in structure" :key="index">
      <v-text-field
        class="mb-2"
        variant="outlined"
        rounded="pill"
        :hint="item.hint"
        v-if="item.type != 'select'"
        density="compact"
        :type="item.type"
        :label="item.label"
        v-model="formData[index]"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
      />
      <v-select
        :error-messages="validate[index].$errors.map((e) => e.$message)"
        v-else
        item-title="label"
        item-value="id"
        variant="outlined"
        rounded="pill"
        :hint="item.hint"
        density="compact"
        :items="item.items"
        :label="item.label"
        v-model="formData[index]"
      />
    </div>
    <v-divider class="my-2"></v-divider>
    <v-btn variant="outlined" rounded="pill" block @click="submit"
      >Submit</v-btn
    >
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

const store = useAppStore();
const emits = defineEmits(['submitted']);
const props = defineProps(['toolData']);
const formData = reactive({
  regNumber: props.toolData ? props.toolData.regNumber : '',
  rankId: props.toolData ? props.toolData.rankId : null,
  type: props.toolData ? props.toolData.type : null,
  toolName: props.toolData ? props.toolData.toolName : '',
});
const structure = reactive({
  regNumber: {
    type: 'text',
    label: 'Registration Number',
    hint: 'Enter Registration Number',
  },
  toolName: {
    type: 'text',
    label: 'Tool Name',
    hint: 'Enter Tool Name',
  },
  rankId: {
    type: 'select',
    label: 'Rank',
    hint: 'Select Rank',
    items: [],
    itemText: 'rankName',
    itemValue: 'id',
  },
  type: {
    type: 'select',
    label: 'Tool Type',
    hint: 'Select Tool Type',
    items: [],
    itemText: 'typeName',
    itemValue: 'id',
  },
});
const rules = {
  regNumber: {
    required: helpers.withMessage('Registration Number is required', required),
  },
  rankId: { required: helpers.withMessage('Rank is required', required) },
  type: { required: helpers.withMessage('Tool Type is required', required) },
  toolName: {
    required: helpers.withMessage('Tool Name is required', required),
  },
};
const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid) {
      throw {
        title: 'Validation Error',
        text: 'Please check the form for errors',
        icon: 'error',
      };
    }
    await store.fetchData(formData, `/tools/${props.toolData.toolId}`, 'PUT');
    emits('submitted');
  } catch (error) {
    store.myAlert.fire(error);
  }
};

const refresh = async () => {
  try {
    const resRanks = await store.fetchData({}, '/ranks', 'GET');
    structure.rankId.items = resRanks.data;
    const resTypes = await store.fetchData({}, '/types', 'GET');
    structure.type.items = resTypes.data;
  } catch (error) {
    console.log(error);
  }
};
onBeforeMount(() => {
  refresh();
});
</script>
