<template>
  <div>
    <v-text-field
      class="my-2"
      v-for="(item, index) in structure"
      :key="index"
      variant="outlined"
      rounded="pill"
      density="compact"
      :hint="item.hint"
      :type="item.type"
      :label="item.label"
      v-model="formData[index]"
      :error-messages="validate[index].$errors.map((e) => e.$message)"
    />
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
const props = defineProps(['toolData']);
const emits = defineEmits(['submitted']);
const formData = reactive({
  label: '',
});
const structure = {
  label: {
    label: 'Label',
    type: 'text',
    hint: 'Enter the label for the inspection item',
  },
};
const rules = {
  label: { required: helpers.withMessage('Label is required', required) },
};
const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid) {
      throw {
        title: 'Validation Error',
        text: 'Please correct the errors in the form.',
        icon: 'error',
      };
    }

    await store.fetchData(
      formData,
      `/inspections/${props.toolData.toolId}/insitems`,
      'POST'
    );
    emits('submitted');
    store.myAlert.fire({
      title: 'Success',
      text: 'Inspection item added successfully.',
      icon: 'success',
    });
  } catch (error) {
    store.myAlert.fire(error);
  }
};
</script>
