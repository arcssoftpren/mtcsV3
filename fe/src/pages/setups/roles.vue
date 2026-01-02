<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="roles"
      item-key="id"
      class="elevation-1"
    >
      <template #top>
        <v-toolbar flat rounded="lg" class="mb-4">
          <v-toolbar-title>Role List</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" rounded="pill" @click="openDialog('new')">
            New Role
          </v-btn>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center justify-center">
          <v-icon
            class="ma-auto"
            color="primary"
            @click="openDialog('edit', item)"
            >mdi-pencil</v-icon
          >
          <v-icon
            class="ma-auto"
            color="warning"
            @click="openDialog('access', item)"
            >mdi-shield-key</v-icon
          >

          <v-icon
            class="ma-auto"
            color="success"
            @click="openDialog('sign', item)"
          >
            mdi-draw
          </v-icon>
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
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <template #append v-if="dialogData.key != 'delete'">
          <v-btn @click="dialog = false" flat icon>
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
          <new-role @close="refresh" v-if="dialogData.key === 'new'" />
          <edit-role
            @close="refresh"
            v-if="dialogData.key === 'edit'"
            :roleData="selected"
          />
          <access-form
            @close="refresh"
            v-if="dialogData.key === 'access'"
            :roleData="selected"
          />
          <div v-if="dialogData.key === 'delete'" class="text-center">
            <h1 class="text-h6">You are about to delete the role:</h1>
            <h1 class="text-h5">
              {{ selected.roleName }}
            </h1>
            <p>This action cannot be undone.</p>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="6">
                <v-btn
                  variant="outlined"
                  rounded="pill"
                  block
                  @click="confirmDelete"
                  >Confirm</v-btn
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

          <div v-if="dialogData.key === 'sign'">
            <v-table class="w-100">
              <thead>
                <tr>
                  <th class="text-left">Signature Name</th>
                  <th class="text-left">Permissions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sign in signID" :key="sign.id">
                  <td>{{ sign.name }}</td>
                  <td>
                    <v-checkbox-btn
                      v-model="signIds[sign.id]"
                      :value="sign.id"
                      :label="sign.name"
                      inline
                      :true-value="1"
                      :false-value="0"
                      @change="updateSignaturePermissions"
                    >
                    </v-checkbox-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <v-divider class="my-2"></v-divider>

            <v-btn variant="outlined" rounded="pill" block @click="refresh"
              >Close</v-btn
            >
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
const signIds = ref({
  signPermissions_1: 0,
  signPermissions_2: 0,
  signPermissions_3: 0,
});
const roles = ref([]);
const headers = [
  { title: 'No', key: 'no', width: '50px' },
  { title: 'Role Name', key: 'roleName' },
  { title: 'Home Page', key: 'homePage' },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
    width: '150px',
    align: 'center',
  },
];
const signID = ref([
  { id: 'signPermissions_1', name: 'QUALITY PIC' },
  { id: 'signPermissions_2', name: 'QUALITY GL/SPV/MGR' },
  { id: 'signPermissions_3', name: 'USER DEPT GL/SVP/MGR' },
]);
const formData = reactive({});
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});

const openDialog = (key, item) => {
  switch (key) {
    case 'new':
      dialogData.key = 'new';
      dialogData.title = 'Create New Role';
      dialogData.subtitle = 'Fill in the details to create a new role';
      break;
    case 'edit':
      dialogData.key = 'edit';
      dialogData.title = 'Edit Role';
      dialogData.subtitle = 'Modify the role details as needed';
      selected.value = item;
      break;
    case 'access':
      dialogData.key = 'access';
      dialogData.title = 'Manage Access';
      dialogData.subtitle = 'Set access permissions for this role';
      selected.value = item;
      break;
    case 'sign':
      dialogData.key = 'sign';
      dialogData.title = 'Manage Signatures';
      dialogData.subtitle = 'Set signature permissions for this role';
      selected.value = item;
      signIds.value.signPermissions_1 = selected.value.signPermissions_1;
      signIds.value.signPermissions_2 = selected.value.signPermissions_2;
      signIds.value.signPermissions_3 = selected.value.signPermissions_3;
      break;
    case 'delete':
      dialogData.key = 'delete';
      dialogData.title = 'Delete Role';
      selected.value = item;
      break;
  }
  dialog.value = true;
};

const confirmDelete = async () => {
  try {
    await store.fetchData({}, `/roles/${selected.value.roleId}`, 'DELETE');
    store.myAlert.fire({
      title: 'Success',
      text: 'Role deleted successfully.',
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

const refresh = async () => {
  dialog.value = false;
  const response = await store.fetchData({}, '/roles', 'GET');
  roles.value = response.data;
  roles.value = roles.value.map((role, index) => ({
    ...role,
    no: index + 1,
  }));

  console.log(roles.value);
};

onBeforeMount(() => {
  refresh();
});

const updateSignaturePermissions = async () => {
  try {
    const payload = {
      roleId: selected.value.roleId,
      signPermissions_1: signIds.value.signPermissions_1,
      signPermissions_2: signIds.value.signPermissions_2,
      signPermissions_3: signIds.value.signPermissions_3,
    };
    await store.fetchData(
      payload,
      `/roles/${selected.value.roleId}/signPermissions`,
      'PUT'
    );
    store.myAlert.fire({
      title: 'Success',
      text: 'Signature permissions updated successfully.',
      icon: 'success',
    });
  } catch (error) {
    store.myAlert.fire({
      title: error.title || 'Error',
      text: error.text || 'An unexpected error occurred.',
      icon: error.icon || 'error',
    });
  }
};
</script>
