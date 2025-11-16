<template>
  <div>
    <v-data-table :items="types" :headers="headers" :search="search">
      <template #top>
        <v-toolbar color="transparent">
          <template #title>
            <div class="pa-4">
              <v-text-field
                variant="outlined"
                rounded="pill"
                density="compact"
                hide-details
                label="Search Types"
                v-model="search"
              />
            </div>
          </template>
          <template #append>
            <v-btn
              @click="openDialog('new')"
              variant="outlined"
              rounded="pill"
              block
              >New Type</v-btn
            >
          </template>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center justify-center">
          <v-icon
            @click="openDialog('edit', item)"
            class="ma-auto"
            color="primary"
            >mdi-pencil</v-icon
          >
          <v-icon
            @click="openDialog('delete', item)"
            class="ma-auto"
            color="error"
            >mdi-delete</v-icon
          >
        </div>
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <template #append v-if="dialogData.key != 'delete'">
          <v-btn @click="dialog = false" flat icon class="mt-2 ms-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title v-if="dialogData.key != 'delete'">{{
          dialogData.title
        }}</template>
        <template #subtitle v-if="dialogData.key != 'delete'">{{
          dialogData.subtitle
        }}</template>
        <template #text>
          <!-- content -->
          <new-type @submitted="refresh" v-if="dialogData.key === 'new'" />
          <edit-type
            @submitted="refresh"
            v-if="dialogData.key === 'edit'"
            :typeData="selected"
          />
          <div class="text-center" v-if="dialogData.key === 'delete'">
            <h1 class="text-h6">You are about to delete this type:</h1>
            <p class="text-h5">{{ selected.label }}</p>
            <p>This action cannot be undone.</p>
            <p><strong>Are you sure you want to proceed?</strong></p>
            <v-divider class="my-2"></v-divider>
            <v-row>
              <v-col cols="6">
                <v-btn
                  variant="outlined"
                  rounded="pill"
                  color="error"
                  block
                  @click="deleteType"
                  >Delete</v-btn
                >
              </v-col>
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
            </v-row>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
const store = useAppStore();
const dialog = ref(false);
const selected = ref(null);
const formData = reactive({});
const search = ref('');
const headers = [
  { title: 'No', key: 'no', align: 'center' },
  { title: 'Label', key: 'label' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
];
const types = ref([]);
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'new':
      dialogData.title = 'New Type';
      dialogData.subtitle = 'Create a new tool type';

      break;
    case 'edit':
      dialogData.title = 'Edit Type';
      dialogData.subtitle = 'Edit tool type';
      selected.value = item;
      break;
    case 'delete':
      selected.value = item;
      break;
  }
  dialog.value = true;
};

const refresh = async () => {
  dialog.value = false;
  try {
    const response = await store.fetchData(null, '/types', 'GET');
    types.value = response.data;
    types.value.forEach((item, index) => {
      item.no = index + 1;
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteType = async () => {
  try {
    await store.fetchData(null, `/types/${selected.value.id}`, 'DELETE');
    dialog.value = false;
    refresh();
  } catch (error) {
    store.myAlert.fire(error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
