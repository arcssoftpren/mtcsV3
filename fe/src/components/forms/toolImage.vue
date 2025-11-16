<template>
  <div class="d-flex flex-column align-center">
    <v-img :src="imageUrl ? imageUrl : defaultImage" width="600" />
    <div class="mt-4 w-100">
      <v-file-input
        :error-messages="validate.image.$errors.map((e) => e.$message)"
        @change="fileChange($event)"
        label="Tool Image"
        prepend-icon=""
        prepend-inner-icon="mdi-image"
        variant="outlined"
        rounded="pill"
        density="compact"
        accept="image/*"
        v-model="formData.image"
        :clearable="false"
      />
      <div class="my-2">
        <v-divider></v-divider>
      </div>
      <v-btn variant="outlined" rounded="pill" block @click="submit"
        >Upload Image</v-btn
      >
    </div>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import defaultImage from '@/assets/images/engineer.png';

const store = useAppStore();
const props = defineProps(['toolData']);
const emits = defineEmits(['updateImage']);
const imageUrl = ref(null);
const formData = reactive({
  image: null,
});
const structure = {};
const rules = {
  image: { required: helpers.withMessage('Image is required', required) },
};
const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid) {
      throw {
        title: 'Validation Error',
        text: 'Please fill in the required fields.',
        icon: 'error',
      };
    }
    const fd = new FormData();
    fd.append('image', formData.image);
    await store.fetchData(fd, `/tools/image/${props.toolData.toolId}`, 'POST', {
      'Content-Type': 'multipart/form-data',
    });
    emits('updateImage');
    store.myAlert.fire({
      title: 'Success',
      text: 'Tool image uploaded successfully.',
      icon: 'success',
    });
  } catch (error) {
    store.myAlert.fire(error);
  }
};

const fileChange = () => {
  const file = formData.image;
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    imageUrl.value = null;
  }
};

const getImage = async () => {
  try {
    const response = await store.fetchData(
      null,
      `/tools/image/${props.toolData.toolId}`,
      'GET'
    );
    if (response) {
      imageUrl.value = response.data
        ? `data:image/png;base64,${response.data}`
        : null;

      formData.image = imageUrl.value
        ? (() => {
            const arr = imageUrl.value.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], 'tool_image.png', { type: mime });
          })()
        : null;
    } else {
      imageUrl.value = null;
    }
  } catch (error) {
    console.log(error);
    store.myAlert.fire(error);
  }
};

onBeforeMount(() => {
  getImage();
});
</script>
