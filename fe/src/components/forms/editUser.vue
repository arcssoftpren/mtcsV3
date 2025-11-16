<template>
  <div class="py-2">
    <div class="mb-2" v-for="(item, index) in structure" :key="index">
      <v-text-field
        v-if="item.type === 'text' || item.type === 'password'"
        variant="outlined"
        rounded="pill"
        density="compact"
        :type="item.type"
        :label="item.label"
        v-model="formData[index]"
        :error-messages="validate[index].$errors.map((e) => e.$message)"
        :hint="item.hint"
        :append-inner-icon="item.innerIcon"
      />
      <v-select
        :items="roles"
        item-title="roleName"
        item-value="roleId"
        v-else
        :error-messages="validate[index].$errors.map((e) => e.$message)"
        :hint="item.hint"
        variant="outlined"
        rounded="pill"
        density="compact"
        :type="item.type"
        :label="item.label"
        v-model="formData[index]"
      />
    </div>
    <small>*Let password empty if you are not changing it.</small>
    <v-switch
      color="primary"
      hide-details=""
      v-model="showPassword"
      label="Show Password"
    />
    <v-divider class="my-4"></v-divider>
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
const props = defineProps(['userData']);
const emits = defineEmits(['submitted']);
const showPassword = ref(false);
const formData = reactive({
  userName: props.userData?.userName || '',
  userNik: props.userData?.userNik || '',
  roleId: props.userData?.roleId || null,
  userPassword: '',
  confirmPassword: '',
});
const structure = reactive({
  userName: {
    type: 'text',
    label: 'User Name',
    hint: 'Enter the user name',
  },
  userNik: {
    type: 'text',
    label: 'NIK',
    hint: 'Enter the NIK',
  },
  roleId: {
    type: 'select',
    label: 'Role',
    hint: 'Select user role',
  },
  userPassword: {
    type: 'password',
    label: 'Password',
    hint: 'Enter the password',
    innerIcon: 'mdi-eye-off',
  },
  confirmPassword: {
    type: 'password',
    label: 'Confirm Password',
    hint: 'Re-enter the password',
    innerIcon: 'mdi-eye-off',
  },
});
const rules = {
  userName: {
    required: helpers.withMessage('User Name is required', required),
  },
  userNik: { required: helpers.withMessage('NIK is required', required) },
  roleId: { required: helpers.withMessage('Role is required', required) },
  userPassword: {
    required: helpers.withMessage('Password is required', () => {
      return true;
    }),
  },
  confirmPassword: {
    sameAsPassword: helpers.withMessage(
      'Passwords must match',
      (value) => value === formData.userPassword
    ),
  },
};
const validate = useVuelidate(rules, formData);
const roles = ref([]);
const refreshRoles = async () => {
  try {
    const res = await store.fetchData({}, '/roles', 'GET');
    roles.value = res.data;
    structure.roleId.options = roles.value.map((role) => ({
      value: role.roleId,
      text: role.roleName,
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

watch(showPassword, (newVal) => {
  structure.userPassword.type = newVal ? 'text' : 'password';
  structure.userPassword.innerIcon = newVal ? 'mdi-eye' : 'mdi-eye-off';
  structure.confirmPassword.type = newVal ? 'text' : 'password';
  structure.confirmPassword.innerIcon = newVal ? 'mdi-eye' : 'mdi-eye-off';
});

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
      {
        userName: formData.userName,
        userNik: formData.userNik,
        roleId: formData.roleId,
        userPassword:
          formData.userPassword === '' ? undefined : formData.userPassword,
      },
      `/users/${props.userData.userId}`,
      'PUT'
    );
    store.myAlert.fire({
      title: 'Success',
      text: 'User updated successfully',
      icon: 'success',
    });
    emits('submitted');
  } catch (error) {
    store.myAlert.fire(error);
  }
};

onBeforeMount(() => {
  refreshRoles();
});
</script>
