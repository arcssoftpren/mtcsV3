<template>
  <div>
    <div class="py-2" v-for="(item, index) in structure" :key="index">
      <v-text-field
        v-if="item.type == 'text'"
        variant="outlined"
        rounded="pill"
        density="compact"
        :type="item.type"
        :label="item.label"
        v-model="formData[index]"
        :hint="item.hint"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
      />
      <v-select
        v-else
        :items="store.menuList"
        variant="outlined"
        rounded="pill"
        density="compact"
        item-title="title"
        item-value="path"
        :type="item.type"
        :label="item.label"
        v-model="formData[index]"
        :hint="item.hint"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
      />
    </div>
    <v-divider class="my-2"></v-divider>
    <v-btn variant="outlined" rounded="pill" block @click="submit"
      >Create Role</v-btn
    >
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';

const emits = defineEmits(['close']);
const store = useAppStore();
const formData = reactive({
  roleName: '',
  homePage: '',
});
const structure = {
  roleName: {
    label: 'Role Name',
    type: 'text',
    hint: 'Enter role name',
  },
  homePage: {
    label: 'Home Page',
    type: 'select',
    hint: 'Select home page URL',
  },
};
const rules = {
  roleName: {
    required: helpers.withMessage('Role Name is required', required),
  },
  homePage: {
    required: helpers.withMessage('Home Page is required', required),
  },
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

    await store.fetchData(formData, '/roles', 'POST');
    store.myAlert.fire({
      title: 'Success',
      text: 'New role created successfully.',
      icon: 'success',
    });
    emits('close');
  } catch (error) {
    store.myAlert.fire({
      title: error.title || 'Error',
      text: error.text || 'An unexpected error occurred.',
      icon: error.icon || 'error',
    });
  }
};
</script>
