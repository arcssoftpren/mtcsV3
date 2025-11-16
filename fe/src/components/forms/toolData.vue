<template>
  <div>
    <v-table>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{ item.label }}</td>
          <td>
            <v-text-field
              :type="item.objectType"
              hide-details
              hide-spin-buttons
              variant="outlined"
              rounded="pill"
              density="compact"
              v-model="item.value"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-row>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12">
        <v-btn variant="outlined" @click="save" rounded="pill" block>
          Save
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const props = defineProps(['toolData']);
const emits = defineEmits(['saved']);
const data = ref([...toRaw(props.toolData.headers)]);

const save = async () => {
  try {
    const mappedData = data.value.map((item) => {
      return {
        id: item.id,
        value: item.value,
      };
    });

    await store.fetchData(
      {
        data: mappedData,
      },
      `/tools/data/${props.toolData.toolId}`,
      'POST'
    );
    emits('saved');
  } catch (error) {
    console.error(error);
  }
};
</script>
