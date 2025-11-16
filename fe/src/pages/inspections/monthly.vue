<template>
  <div>
    <v-toolbar color="transparent" flat>
      <v-toolbar-title>SPV Report</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="month"
        variant="outlined"
        rounded="pill"
        density="compact"
        type="month"
      />
    </v-toolbar>
    <v-data-table
      :search="search"
      :items="inspections"
      :headers="[
        { title: 'Tool Name', key: 'toolName' },
        { title: 'Register Number', key: 'regNumber' },
        { title: 'Location', key: 'location' },
        { title: 'Actions', key: 'actions', align: 'center' },
      ]"
    >
      <template #top>
        <v-text-field
          variant="outlined"
          rounded="pill"
          density="compact"
          label="Search Tools"
          v-model="search"
        />
      </template>

      <template #item.actions="{ item }">
        <v-btn
          @click="openDialog('inspect', item)"
          variant="outlined"
          rounded="pill"
          :color="getColor(item)"
          block
          :disabled="noData(item)"
        >
          {{
            getColor(item) == 'red'
              ? 'Abnormality Detected'
              : noData(item)
                ? 'No Data'
                : 'Check Now'
          }}
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      fullscreen
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
          <monthly-inspection
            :inspections-data="selected"
            :month="month"
            @confirmed="refresh()"
          />
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
const inspections = ref([]);
const search = ref('');
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});
const month = ref(moment().format('YYYY-MM'));

const openDialog = (key, item) => {
  switch (key) {
    case 'inspect':
      selected.value = item;
      dialogData.title = `Inspection for ${item.toolName}`;
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

const getColor = (item) => {
  const inspections = item.inspections.filter((ins) => ins !== null);
  if (inspections.length === 0) return 'grey';
};

const noData = (item) => {
  const inspections = item.inspections.filter((ins) => ins !== null);
  if (inspections.length === 0) return true;
  return false;
};

const refresh = async () => {
  try {
    const res = await store.fetchData(
      {
        month: month.value,
      },
      '/inspections/monthly',
      'post'
    );
    inspections.value = res.data;
    dialog.value = false;
  } catch (error) {
    store.myAlert.fire(error);
    console.log(error);
  }
};

watch(month, () => {
  refresh();
});

onBeforeMount(() => {
  refresh();
});
</script>
