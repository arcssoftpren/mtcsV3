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
        <v-btn-group variant="outlined" rounded="pill">
          <v-btn @click="openDialog('inspect', item)"> check now </v-btn>
          <v-btn color="warning" @click="openDialog('notused', item)">
            Not Used
          </v-btn>
        </v-btn-group>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :fullscreen="dialogData.key == 'inspect'"
      :overlay="false"
      transition="dialog-transition"
      max-width="600"
    >
      <v-card v-if="dialogData.key == 'inspect'">
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
      <v-card v-else class="text-center">
        <template #text>
          <h1 class="text-h5">
            You are about to mark this tool as unused today
          </h1>
          <h1 class="text-h4">{{ selected.toolName }}</h1>
          <p>{{ selected.regNumber }}</p>
          <v-icon size="120" color="warning" class="my-2">
            mdi-help-circle-outline
          </v-icon>
          <div class="my-2">
            <v-divider></v-divider>
          </div>
          <v-row>
            <v-col cols="6">
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="dialog = false"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                @click="unused"
                variant="outlined"
                rounded="pill"
                block
                color="red"
              >
                Confirm
              </v-btn>
            </v-col>
          </v-row>
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
    case 'notused':
      selected.value = item;
      break;
    case 'delete':
      selected.value = item;
      return;
  }
  dialog.value = true;
};

const unused = async () => {
  try {
    const toolId = selected.value.toolId;
    const date = moment().format('YYYY-MM-DD');
    const response = await store.fetchData(
      {
        toolId,
        date,
        inspector: store.userData.userId,
      },
      '/inspections/notused',
      'post'
    );

    store.myAlert.fire(response);
    dialog.value = false;
    refresh();
  } catch (error) {
    console.log(error);
  }
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
