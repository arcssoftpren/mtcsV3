<template>
  <div>
    <v-toolbar color="transparent" flat>
      <template #title> Finished Inspections </template>
      <v-spacer></v-spacer>
      <v-text-field
        variant="outlined"
        rounded="pill"
        density="compact"
        type="month"
        label="Select Month"
        v-model="month"
        hide-details=""
      />
    </v-toolbar>
    <v-data-table
      :search="search"
      :items="tools"
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
          label="Search Tool"
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
      fullscreen
      persistent
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn flat icon="mdi-close" @click="dialog = false" />
        </template>
        <template #title>
          <v-toolbar color="transparent">
            <template #title>PDF Viewer</template>
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
              <pdf
                :scale="scale"
                :documentNumber="documentNumber"
                :paperSize="paperSize"
                :inspections-data="selected"
                :month="month"
              ></pdf>
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

const store = useAppStore();
const month = ref(moment().format('YYYY-MM'));
const tools = ref([]);
const search = ref(null);
const dialog = ref(false);
const scale = ref(0.5);
const documentNumber = ref('Format-I7603-001');
const paperSize = ref('A3');

const selected = ref(null);
const panningElement = ref(null);
const isPanning = ref(false);
const startX = ref(0);
const startY = ref(0);
const scrollLeft = ref(0);
const scrollTop = ref(0);

const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});

watch(month, () => {
  refresh();
});

const refresh = async () => {
  try {
    const response = await store.fetchData(
      { month: month.value },
      '/inspection/finished',
      'post'
    );

    tools.value = response.data;
  } catch (error) {
    console.log(error);
    store.myAlert.fire(error);
  }
};

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

const noData = (item) => {
  const inspections = item.inspections.filter((ins) => ins !== null);
  if (inspections.length === 0) return true;
  return false;
};

const getColor = (item) => {
  const inspections = item.inspections.filter((ins) => ins !== null);
  if (inspections.length === 0) return 'grey';
};

const startPan = (e) => {
  if (!panningElement.value) return;

  const element = panningElement.value;

  // Always allow panning attempt
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
