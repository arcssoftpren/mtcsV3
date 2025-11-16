<template>
  <div>
    <v-row>
      <v-col cols="6" v-for="(item, index) in accessList_store" :key="index">
        <v-checkbox-btn
          @change="updateAccess(item.path)"
          :label="item.title"
          v-model="item.checked"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';

const props = defineProps(['roleData']);
const emits = defineEmits(['close']);
const store = useAppStore();

const accessList = ref([]);

const accessList_store = ref([
  ...toRaw(store.menuList),
  ...toRaw(store.setupList),
]);

const refresh = async () => {
  try {
    const res = await store.fetchData(
      {},
      `/access/${props.roleData.roleId}`,
      'GET'
    );
    accessList.value = res.data;
    store.userData['access'] = accessList.value.map((item) => item.path);

    accessList_store.value = accessList_store.value.map((item) => {
      return {
        ...item,
        checked: accessList.value.some((access) => access.path === item.path),
      };
    });
  } catch (error) {
    store.myAlert.fire({
      title: error.title || 'Error',
      text: error.text || 'An unexpected error occurred.',
      icon: error.icon || 'error',
    });
  }
};

const updateAccess = async (path) => {
  try {
    const checked = accessList_store.value.find(
      (item) => item.path === path
    ).checked;
    await store.fetchData(
      { path },
      `/access/${props.roleData.roleId}`,
      checked ? 'PUT' : 'DELETE'
    );
    store.myAlert.fire({
      title: 'Success',
      text: 'Access updated successfully.',
      icon: 'success',
    });
    refresh();
  } catch (error) {
    store.myAlert.fire({
      title: error.title || 'Error',
      text: error.text || 'An unexpected error occurred.',
      icon: error.icon || 'error',
    });
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
