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
          <!-- <v-btn
            @click="openDialog('new')"
            variant="outlined"
            size="small"
            class="me-2"
          >
            New
          </v-btn>
          <v-btn @click="refresh" variant="outlined" size="small" class="me-2">
            Refresh
          </v-btn> -->
        </v-toolbar>
      </template>
      <template #item.statusName="{ item }">
        <v-chip
          v-if="item.status != 1"
          :color="item.status == 0 ? 'red' : item.status == 2 ? 'grey' : 'grey'"
          text-color="white"
          small
        >
          {{ item.statusName }}
        </v-chip>
        <v-btn
          v-else
          variant="outlined"
          color="green"
          size="small"
          @click="openReportDialog(item)"
        >
          {{ item.statusName }}
        </v-btn>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          :disabled="item.status == 1"
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

    <!-- Dialog for Closed Report -->
    <v-dialog
      v-model="reportDialog"
      scrollable
      fullscreen
      persistent
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn flat icon="mdi-close" @click="reportDialog = false" />
        </template>
        <template #title>
          <v-toolbar color="transparent">
            <template #title>Abnormality Report PDF</template>
            <v-text-field
              variant="outlined"
              rounded="pill"
              density="compact"
              hide-details
              label="Document Number"
              v-model="documentNumber"
            />
            <v-spacer> </v-spacer>
            <v-slider
              v-model="scale"
              :min="0.5"
              :max="2.0"
              :step="0.05"
              hide-details
            >
              <template #label>
                Zoom: {{ (scale * 100).toFixed(0) }}%
              </template>
            </v-slider>
          </v-toolbar>
        </template>
        <template #text>
          <div
            ref="panningElement"
            class="w-100 h-100 bg-grey panning-element rounded-lg"
            @mousedown="startPan"
            @mousemove="doPan"
            @mouseup="endPan"
            @mouseleave="endPan"
            style="overflow: auto; cursor: grab"
          >
            <div style="text-align: center; min-width: 100%">
              <abnormal-pdf
                :scale="scale"
                :documentNumber="documentNumber"
                :abnormalityData="selectedReport"
              ></abnormal-pdf>
            </div>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import moment from 'moment';
import AbnormalPdf from '@/components/inspections/abnormalPdf.vue';

const store = useAppStore();
const dialog = ref(false);
const reportDialog = ref(false);
const selected = ref(null);
const selectedReport = ref(null);
const reportDialogSubtitle = ref('');
const scale = ref(0.65);
const documentNumber = ref('Form-7161-001');
const panningElement = ref(null);
const isPanning = ref(false);
const startX = ref(0);
const startY = ref(0);
const scrollLeft = ref(0);
const scrollTop = ref(0);
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

const openReportDialog = (item) => {
  selectedReport.value = item;
  reportDialogSubtitle.value = `${item.toolName} - ${item.regNumber}`;
  reportDialog.value = true;
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
                ? 'Closed'
                : abnormality.status == 2
                  ? 'Disposed'
                  : 'Unknown',
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

const startPan = (e) => {
  if (!panningElement.value) return;

  const element = panningElement.value;

  isPanning.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  scrollLeft.value = element.scrollLeft;
  scrollTop.value = element.scrollTop;
  element.style.cursor = 'grabbing';
  element.style.userSelect = 'none';
};

const doPan = (e) => {
  if (!isPanning.value || !panningElement.value) return;

  e.preventDefault();
  const element = panningElement.value;

  const deltaX = e.clientX - startX.value;
  const deltaY = e.clientY - startY.value;

  element.scrollLeft = scrollLeft.value - deltaX;
  element.scrollTop = scrollTop.value - deltaY;
};

const endPan = () => {
  if (!panningElement.value) return;
  isPanning.value = false;
  panningElement.value.style.cursor = 'grab';
  panningElement.value.style.userSelect = '';
};

onBeforeMount(() => {
  refresh();
});
</script>
