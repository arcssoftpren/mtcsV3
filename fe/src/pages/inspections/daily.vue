<template>
  <div>
    <v-toolbar color="transparent">
      <v-toolbar-title> Daily Operator Inspection </v-toolbar-title>
    </v-toolbar>
    <v-data-table
      :items="inspections"
      :headers="[
        {
          title: 'No',
          key: 'no',
          align: 'center',
          width: '50px',
        },
        { title: 'Registration Number', key: 'regNumber' },
        {
          title: 'Tool Name',
          key: 'toolName',
        },
        {
          title: 'Actions',
          key: 'actions',
          align: 'center',
          sortable: false,
        },
      ]"
      class="elevation-1"
    >
      <template #top>
        <v-text-field
          class="ma-4"
          variant="outlined"
          rounded="pill"
          density="compact"
          label="Search Tool"
        />
      </template>
      <template #item.actions="{ item }">
        <v-btn
          @click="openDialog('inspect', item)"
          variant="outlined"
          rounded="pill"
          block
        >
          check now
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      fullscreen
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn @click="dialog = false" flat icon class="mt-2 ms-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <!-- content -->
          <daily-inspections
            @submit-success="refresh"
            :tool-data="selected"
          ></daily-inspections>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import moment from 'moment';

const store = useAppStore();
const dialog = ref(false);
const selected = ref(null);
const formData = reactive({});
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});
const inspections = ref([]);

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'inspect':
      selected.value = item;
      dialogData.title = 'Inspect Tool';
      dialogData.subtitle = moment().format('dddd, MMMM Do YYYY');
      break;
    case 'edit':
      selected.value = item;
      break;
    case 'delete':
      selected.value = item;
      return;
  }
  dialog.value = true;
};

const refresh = async () => {
  try {
    const res = await store.fetchData({}, '/inspections/daily');
    inspections.value = res.data.map((i, index) => ({
      ...i,
      no: index + 1,
    }));
    dialog.value = false;
  } catch (error) {
    store.myAlert.fire(error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
