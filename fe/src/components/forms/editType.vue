<template>
  <div class="py-2">
    <div v-for="(item, index) in structure" :key="index">
      <v-text-field
        variant="outlined"
        rounded="pill"
        density="compact"
        :type="item.type"
        :label="item.label"
        v-model="formData[index]"
        :hint="item.hint"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
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
const props = defineProps(['typeData']);
const emits = defineEmits(['submitted']);
const formData = reactive({
  label: props.typeData ? props.typeData.label : '',
});
console.log(props);
const structure = {
  label: {
    type: 'text',
    label: 'Label',
    hint: 'Enter type label',
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
        text: 'Please fix the errors in the form',
        icon: 'error',
      };
    }
    await store.fetchData(formData, `/types/${props.typeData.id}`, 'PUT');
    emits('submitted');
  } catch (error) {
    store.myAlert.fire(error);
  }
};
</script>
