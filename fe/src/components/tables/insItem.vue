<template>
  <div>
    <v-toolbar class="" color="transparent">
      <template #title> {{ toolData.regNumber }} Inspection Items </template>
    </v-toolbar>
    <v-data-table :headers="headers" :items="items">
      <template #top>
        <v-toolbar color="transparent">
          <template #title>
            <div class="px-2">
              <v-text-field
                variant="outlined"
                rounded="pill"
                density="compact"
                hide-details
                label="Search Inspection Items"
              />
            </div>
          </template>
          <template #append>
            <v-btn
              @click="openDialog('new')"
              variant="outlined"
              rounded="pill"
              block
              >Add New Item</v-btn
            >
          </template>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex justify-center align-center">
          <v-icon
            class="ma-auto"
            color="primary"
            @click="openDialog('edit', item)"
            >mdi-pencil</v-icon
          >
          <v-icon
            class="ma-auto"
            color="error"
            @click="openDialog('delete', item)"
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
      :max-width="dialogData.key == 'edit' ? '800px' : '500px'"
      transition="dialog-transition"
    >
      <v-card>
        <template #append v-if="dialogData.key != 'delete'">
          <v-btn @click="dialog = false" flat icon class="mt-2 ms-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title v-if="dialogData.key != 'delete'">
          {{ dialogData.title }}
          {{ dialogData.key == 'new' ? 'For' : 'of' }}
          {{ props.toolData.regNumber }}
        </template>
        <template #subtitle v-if="dialogData.key != 'delete'">{{
          dialogData.subtitle
        }}</template>
        <template #text>
          <!-- content -->
          <new-ins-item
            v-if="dialogData.key === 'new'"
            :tool-data="props.toolData"
            @submitted="refresh"
          />
          <edit-ins-item
            v-else-if="dialogData.key === 'edit'"
            :item-data="selected"
            @submitted="refresh"
          />
          <div v-if="dialogData.key === 'delete'" class="text-center">
            <h1 class="text-h6">
              You are about to delete this inspection item:
            </h1>
            <p class="text-h5">
              <strong>{{ selected?.label }}</strong>
            </p>
            <p>Are you sure you want to delete this inspection item?</p>
            <v-icon size="80" color="warning" class="my-4">
              mdi-help-circle-outline
            </v-icon>
            <v-row dense>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>

              <v-col cols="6">
                <v-btn
                  @click="deleteItem"
                  variant="outlined"
                  rounded="pill"
                  block
                  color="error"
                >
                  Delete
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  @click="dialog = false"
                  variant="outlined"
                  rounded="pill"
                  block
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
const emits = defineEmits(['submitted']);
const props = defineProps(['toolData']);
const dialog = ref(false);
const headers = [
  { title: 'No', key: 'no', align: 'center' },
  { title: 'Label', key: 'label' },
  {
    width: '120px',
    title: 'Actions',
    key: 'actions',
    sortable: false,
    align: 'center',
  },
];
const items = ref([]);
const selected = ref(null);
const formData = reactive({});
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'new':
      dialogData.title = 'Add New Inspection Item';
      dialogData.subtitle = 'Fill in the form below to add a new item.';
      break;
    case 'edit':
      dialogData.title = 'Edit Inspection Item';
      dialogData.subtitle = 'Modify the fields below and save changes.';
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
  const res = await store.fetchData(
    null,
    `/inspections/${props.toolData.toolId}/insitems`,
    'GET'
  );
  items.value = res.data.map((item, index) => {
    item.no = index + 1;
    return item;
  });
  emits('submitted');
};

const deleteItem = async () => {
  try {
    await store.fetchData(
      null,
      `/inspections/insitems/${selected.value.insId}`,
      'DELETE'
    );
    dialog.value = false;
    refresh();
    store.myAlert.fire({
      title: 'Inspection Item Deleted',
      text: 'The inspection item has been deleted successfully.',
      icon: 'success',
    });
  } catch (error) {
    store.myAlert.fire(error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
