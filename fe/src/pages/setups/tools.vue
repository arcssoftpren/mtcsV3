<template>
  <div>
    <v-toolbar flat color="transparent" class="mb-4">
      <v-toolbar-title>Tools Management</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        @click="openDialog('type')"
        color="primary"
        variant="outlined"
        rounded="pill"
      >
        Types List
      </v-btn>
    </v-toolbar>
    <v-data-table :items="tools" :headers="headers" :search="search">
      <template #top>
        <v-toolbar color="transparent">
          <template #title>
            <div class="py-2">
              <v-text-field
                label="Search Tools"
                class="mx-4"
                variant="outlined"
                rounded="pill"
                density="compact"
                hide-details=""
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
              >Add Tool</v-btn
            >
          </template>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center justify-center">
          <v-icon
            @click="openDialog('edit', item)"
            color="primary"
            class="ma-auto"
            >mdi-pencil</v-icon
          >
          <v-icon color="" class="ma-auto" @click="openDialog('insitem', item)"
            >mdi-menu</v-icon
          >
          <v-icon class="ma-auto" @click="openDialog('image', item)"
            >mdi-image</v-icon
          >
          <v-icon
            @click="openDialog('data', item)"
            color="warning"
            class="ma-auto"
            >mdi-file</v-icon
          >
          <v-icon
            @click="openDialog('delete', item)"
            color="error"
            class="ma-auto"
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
      :max-width="
        dialogData.key == 'type' ||
        dialogData.key == 'insitem' ||
        dialogData.key == 'data' ||
        dialogData.key == 'image'
          ? '900px'
          : '500px'
      "
      transition="dialog-transition"
    >
      <v-card class="w-100">
        <template v-if="dialogData.key != 'delete'" #append>
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
          <types v-if="dialogData.key == 'type'" />
          <new-tool @submitted="refresh" v-if="dialogData.key == 'new'" />
          <edit-tool
            :toolData="selected"
            @submitted="refresh"
            v-if="dialogData.key == 'edit'"
          />
          <ins-item :toolData="selected" v-if="dialogData.key == 'insitem'" />
          <tool-image
            :toolData="selected"
            v-if="dialogData.key == 'image'"
            @update-image="refresh"
          />
          <tool-data
            :toolData="selected"
            v-if="dialogData.key == 'data'"
            @saved="refresh"
          />

          <div v-if="dialogData.key === 'delete'" class="text-center">
            <h1 class="text-h6">You are about to delete the tool:</h1>
            <h1 class="text-h5">
              {{ selected.regNumber }} - {{ selected.toolName }}
            </h1>
            <p>This action cannot be undone.</p>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="6">
                <v-btn
                  variant="outlined"
                  rounded="pill"
                  block
                  color="error"
                  @click="confirmDelete"
                  >Delete</v-btn
                >
              </v-col>
              <v-col cols="6">
                <v-btn
                  variant="outlined"
                  rounded="pill"
                  block
                  @click="dialog = false"
                  >Cancel</v-btn
                >
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
const tools = ref([]);
const search = ref('');
const headers = [
  { title: 'No.', key: 'no', sortable: false },
  { title: 'Registration Number', key: 'regNumber' },
  { title: 'Tool Name', key: 'toolName' },
  { title: 'Type', key: 'typeName' },
  { title: 'Rank', key: 'rankName' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
];
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'type':
      dialogData.title = 'Types Management';
      dialogData.subtitle = 'Manage tool types';
      break;
    case 'insitem':
      selected.value = item;
      dialogData.title = 'Inspection Items';
      dialogData.subtitle = 'Manage inspection items for the tool';
      break;
    case 'new':
      dialogData.title = 'Add New Tool';
      dialogData.subtitle = 'Fill in the details to add a new tool';
      break;
    case 'edit':
      dialogData.title = 'Edit Tool';
      dialogData.subtitle = 'Modify the tool details';
      selected.value = item;
      break;
    case 'image':
      selected.value = item;
      dialogData.title = 'Tool Image';
      dialogData.subtitle = 'Manage tool image';
      break;
    case 'data':
      selected.value = item;
      dialogData.title = 'Tool Data Sheet';
      dialogData.subtitle = 'Manage tool data sheet';
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
    const res = await store.fetchData({}, '/tools', 'GET');
    tools.value = res.data;
    tools.value = tools.value.map((tool, index) => {
      tool.no = index + 1;
      return tool;
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
  }
};

const confirmDelete = async () => {
  try {
    await store.fetchData({}, `/tools/${selected.value.toolId}`, 'DELETE');
    store.myAlert.fire({
      title: 'Success',
      text: 'Tool deleted successfully.',
      icon: 'success',
    });
    dialog.value = false;
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
