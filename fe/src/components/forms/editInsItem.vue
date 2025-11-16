<template>
  <div>
    <v-toolbar rounded="lg" class="mb-2" flat>
      <template #append>
        <div class="pa-2">
          <v-btn @click="submit" variant="outlined" rounded="pill" block>
            Change
          </v-btn>
        </div>
      </template>
      <template #title>
        <div class="pa-2">
          <v-text-field
            v-model="formData.label"
            hide-details
            label="Edit Label"
            variant="outlined"
            rounded="pill"
            density="compact"
            :error-messages="validate.label.$errors.map((e) => e.$message)"
          />
        </div>
      </template>
    </v-toolbar>
    <v-data-table
      :items="methods"
      :headers="[
        { title: 'No.', key: 'no', width: '50px', align: 'center' },
        { title: 'Label', key: 'label' },
        { title: 'Logic', key: 'logicLabel' },
        {
          title: 'Standard',
          key: 'standardString',
          align: 'center',
          sortable: false,
        },
        { sortable: false, title: 'Actions', key: 'actions', align: 'center' },
      ]"
      class="elevation-1"
      rounded="lg"
      dense
    >
      <template #item.actions="{ item }">
        <div class="d-flex justify-center align-center">
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
      <template #top>
        <v-toolbar color="transparent">
          <template #title>
            <div class="px-2">Method List</div>
          </template>
          <template #append>
            <div class="px-2">
              <v-btn
                @click="openDialog('new')"
                variant="outlined"
                rounded="pill"
                block
                >Add Method</v-btn
              >
            </div>
          </template>
        </v-toolbar>
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
          <new-method
            v-if="dialogData.key === 'new'"
            :item-data="itemData"
            @submitted="refresh"
          ></new-method>
          <edit-method
            v-if="dialogData.key === 'edit'"
            :item-data="itemData"
            :method-data="selected"
            @submitted="refresh"
          ></edit-method>
          <div v-if="dialogData.key === 'delete'" class="text-center">
            <h1 class="text-h6">You are about to delete this method:</h1>
            <p class="text-h5">
              <strong>{{ selected?.label }}</strong>
            </p>
            <p>Are you sure you want to delete this method</p>
            <v-icon size="80" color="warning" class="my-4">
              mdi-help-circle-outline
            </v-icon>
            <v-row dense>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>

              <v-col cols="6">
                <v-btn
                  @click="deleteMethod"
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
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { inspectionHelper } from '@/assets/js/helper';

const store = useAppStore();
const props = defineProps(['itemData']);
const emits = defineEmits(['submitted']);
const dialog = ref(false);
const selected = ref(null);
const methods = ref([]);
const formData = reactive({
  label: props.itemData.label,
});
const rules = {
  label: { required: helpers.withMessage('Label is required', required) },
};

const validate = useVuelidate(rules, formData);
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'new':
      dialogData.title = 'Add New Inspection Method';
      dialogData.subtitle = 'Fill in the form below to add a new method.';
      break;
    case 'edit':
      dialogData.title = 'Edit Inspection Method';
      dialogData.subtitle = 'Modify the inspection method details below.';
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
    `/inspections/${props.itemData.insId}/methods`,
    'GET'
  );
  methods.value = res.data.map((item, index) => {
    const ins = new inspectionHelper();
    ins.setId(item.logic);
    ins.standards = JSON.parse(item.standard);
    item.standardString = `${ins.selectedLogic.standardString()} ${item.unit != null ? item.unit : ''}`;
    item.no = index + 1;
    return item;
  });
};

const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid) {
      throw {
        title: 'Validation Error',
        text: 'Please correct the errors in the form.',
        icon: 'error',
      };
    }

    await store.fetchData(
      formData,
      `/inspections/${props.itemData.insId}/insitems`,
      'PUT'
    );
    emits('submitted');
    dialog.value = false;
  } catch (error) {
    store.myAlert.fire(error);
  }
};

const deleteMethod = async () => {
  try {
    await store.fetchData(
      null,
      `/inspections/methods/${selected.value.methodId}`,
      'DELETE'
    );
    refresh();
    dialog.value = false;
  } catch (error) {
    store.myAlert.fire(error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
