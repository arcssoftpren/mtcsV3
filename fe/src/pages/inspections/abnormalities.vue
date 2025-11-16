<template>
  <div>
    <v-data-table
      :items="abnormalities"
      :headers="[
        { title: 'No', key: 'no' },
        { title: 'Tool Name', key: 'toolName' },
        { title: 'Register Number', key: 'regNumber' },
        { title: 'User Department', key: 'userDepartment' },
        { title: 'Finding Date', key: 'findingDate' },
        { title: 'Finding', key: 'findingDescription', maxWidth: '300' },
        { title: 'Status', key: 'statusName', align: 'center' },
        { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
      ]"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat color="transparent">
          <v-toolbar-title>Abnormalities</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            @click="openDialog('new')"
            variant="outlined"
            size="small"
            class="me-2"
          >
            New
          </v-btn>
          <v-btn @click="refresh" variant="outlined" size="small" class="me-2">
            Refresh
          </v-btn>
        </v-toolbar>
      </template>
      <template #item.statusName="{ item }">
        <v-chip
          :color="
            item.status == 0 ? 'red' : item.status == 1 ? 'green' : 'grey'
          "
          text-color="white"
          small
        >
          {{ item.statusName }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          variant="outlined"
          rounded="pill"
          block
          @click="openDialog('review', item)"
          >Review</v-btn
        >
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="950px"
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn
            @click="dialog = false"
            density="compact"
            variant="outlined"
            icon
            class="mt-2 ms-2"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <!-- content -->
          <abnormalities-detail
            @submitted="refresh"
            v-if="dialogData.key === 'review'"
            :abnormalityData="selected"
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
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});
const abnormalities = ref([]);

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'new':
      break;
    case 'review':
      selected.value = item;
      dialogData.title = 'Review Abnormality';
      dialogData.subtitle = `Review details for ${item.toolName} - ${item.regNumber}`;
      break;
    case 'delete':
      selected.value = item;
      return;
  }
  dialog.value = true;
};

const refresh = async () => {
  try {
    const response = await store.fetchData({}, '/inspections/abnormalities');
    abnormalities.value = await Promise.all(
      response.data.map(async (abnormality, index) => {
        return {
          id: abnormality.id,
          cause: abnormality.cause,
          no: index + 1,
          toolName: abnormality.toolName,
          regNumber: abnormality.regNumber,
          findingDate: moment(abnormality.findingDate).format('DD/MM/YYYY'),
          findingDescription: abnormality.findingDescription,
          userDepartment: abnormality.userDepartment,
          statusName:
            abnormality.status == 0
              ? 'Open'
              : abnormality.status == 1
                ? 'Repaired'
                : 'Disposed',
          status: abnormality.status,
          actions: abnormality.tempActions,
          reporterName: abnormality.reporterName,
          type: abnormality.type,
          location: abnormality.location,
          lastCalibrationDate: abnormality.lastCalibrationDate
            ? moment(abnormality.lastCalibrationDate).format('DD/MM/YYYY')
            : 'N/A',
          confirmatorName: abnormality.confirmatorName || null,
          confirmator: abnormality.confirmator || null,
        };
      })
    );
    dialog.value = false;
  } catch (error) {
    console.error('Error fetching abnormalities:', error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
