<template>
  <div>
    <v-card class="w-100 mb-4">
      <v-card-title>Current Signature</v-card-title>
      <v-card-text>
        <div class="w-100 d-flex justify-center">
          <v-img
            :src="dataUrl ? dataUrl : defaultSign"
            max-width="200"
            max-height="200"
          />
        </div>
      </v-card-text>
    </v-card>
    <v-file-input
      v-model="file"
      label="Upload Signature"
      accept="image/*"
      prepend-inner-icon="mdi-upload"
      prepend-icon=""
      variant="outlined"
      rounded="pill"
      dense
      hide-details
    />
    <v-divider class="my-4"></v-divider>
    <v-btn variant="outlined" rounded="pill" block @click="uploadSignature"
      >Upload</v-btn
    >
  </div>
</template>
<script setup>
import defaultSign from '@/assets/images/defaultSign.png';
import { useAppStore } from '@/stores/app';

const props = defineProps(['userData']);
const emit = defineEmits(['submitted']);
const store = useAppStore();
const file = ref(null);
const dataUrl = ref(null);

watch(file, (newFile) => {
  if (newFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      dataUrl.value = e.target.result;
    };
    reader.readAsDataURL(newFile);
  } else {
    dataUrl.value = null;
  }
});

const uploadSignature = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append('signature', file.value);

  // Make API call to upload signature
  // Example:
  // await axios.post('/upload-signature', formData);
  await store.fetchData(
    formData,
    `/users/${props.userData.userId}/signature`,
    'POST',
    {
      'Content-Type': 'multipart/form-data',
    }
  );
  emit('submitted');
};

const refresh = async () => {
  file.value = null;
  dataUrl.value = null;
  try {
    const res = await store.fetchData(
      {},
      `/users/${props.userData.userId}/signature`
    );
    dataUrl.value = res.data ? `data:image/png;base64,${res.data}` : null;
    file.value = dataUrl.value
      ? (() => {
          const arr = dataUrl.value.split(',');
          const mime = arr[0].match(/:(.*?);/)[1];
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], 'signature.png', { type: mime });
        })()
      : null;
  } catch (error) {
    file.value = null;
    dataUrl.value = null;
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
