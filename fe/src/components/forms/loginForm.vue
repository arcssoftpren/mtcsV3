<template>
  <v-card class="w-100">
    <template #text>
      <div
        class="d-flex text-center align-center justify-center w-100 h-100 flex-column"
      >
        <v-img src="@/assets/images/softpren.png" width="150" class="mb-5" />
        <h1 class="text-h5 my-2">WELCOME TO</h1>
        <h1 class="text-h4 my-2">SOFTPREN MTCS</h1>
        <h1 class="text-body-1 my-2">MEASUREMENT TOOLS CONTROL SYSTEM</h1>
        <div class="w-100">
          <v-text-field
            :error-messages="validate[index].$errors.map((e) => e.$message)"
            class="mb-1"
            v-for="(item, index) in structure"
            :key="index"
            variant="outlined"
            rounded="pill"
            density="compact"
            :hint="item.hint"
            :type="item.type"
            :label="item.label"
            v-model="formData[index]"
            :append-inner-icon="item.innerIcon"
          />
          <v-switch hide-details label="Show Password" v-model="showPassword" />
          <v-divider></v-divider>
          <v-btn variant="outlined" rounded="pill" block @click="submit"
            >Login</v-btn
          >
        </div>
      </div>
    </template>
  </v-card>
</template>
<script setup>
import router from '@/router';
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
const store = useAppStore();
const formData = reactive({
  userNik: '',
  userPassword: '',
});
const structure = {
  userNik: {
    label: 'NIK',
    type: 'text',
    hint: 'Enter your NIK',
  },
  userPassword: {
    label: 'Password',
    type: 'password',
    hint: 'Enter your password',
    innerIcon: 'mdi-eye-off',
  },
};
const rules = {
  userNik: { required: helpers.withMessage('NIK is required', required) },
  userPassword: {
    required: helpers.withMessage('Password is required', required),
  },
};
const validate = useVuelidate(rules, formData);

const showPassword = ref(false);
watch(showPassword, (newVal) => {
  structure.userPassword.type = newVal ? 'text' : 'password';
  structure.userPassword.innerIcon = newVal ? 'mdi-eye' : 'mdi-eye-off';
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

    const response = await store.fetchData(formData, '/login', 'POST');
    console.log(response);
    store.token = response.token;
    store.userData = response.userData;

    // Show success alert
    store.myAlert.fire({
      title: 'Login Successful',
      text: 'You have been logged in successfully.',
      icon: 'success',
    });

    setTimeout(() => {
      router.push(store.userData?.homePage);
    }, 500);

    // Redirect to dashboard
    // window.location.href = '/dashboard';
  } catch (error) {
    store.myAlert.fire(error);
  }
};
</script>
