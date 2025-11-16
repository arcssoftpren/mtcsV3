<template>
  <div>
    <v-toolbar flat color="transparent" class="mb-4">
      <v-toolbar-title>Users Management</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        @click="openDialog('new')"
        color="primary"
        variant="outlined"
        rounded="pill"
      >
        <v-icon left>mdi-plus</v-icon> New User
      </v-btn>
    </v-toolbar>
    <v-data-table :items="users" :headers="headers" :search="search">
      <template #top>
        <v-text-field
          variant="outlined"
          rounded="pill"
          density="compact"
          v-model="search"
          label="Search Users"
        />
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex justify-center align-center">
          <v-icon
            @click="openDialog('edit', item)"
            class="ma-auto"
            color="primary"
            >mdi-pencil</v-icon
          >
          <v-icon
            class="ma-auto"
            @click="openDialog('uploadSignature', item)"
            color="success"
            >mdi-draw</v-icon
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
          <new-user @submitted="refresh" v-if="dialogData.key === 'new'" />
          <edit-user
            :userData="selected"
            @submitted="refresh"
            v-else-if="dialogData.key === 'edit'"
          />
          <upload-sign
            :userData="selected"
            @submitted="refresh"
            v-else-if="dialogData.key === 'uploadSignature'"
          />
          <div v-if="dialogData.key == 'delete'" class="text-center">
            <h1 class="text-h6">You are about to delete this user.</h1>
            <h1 class="text-h5">{{ selected.userName }}</h1>
            <p>This action cannot be undone.</p>
            <p>Are you sure?</p>
            <v-divider class="my-2"></v-divider>
            <v-row>
              <v-col cols="6">
                <v-btn
                  color="error"
                  variant="outlined"
                  rounded="pill"
                  block
                  @click="deleteUser"
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
const users = ref([]);
const search = ref('');
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});
const headers = [
  { title: 'No', key: 'no', align: 'center' },
  { title: 'User Name', key: 'userName' },
  { title: 'NIK', key: 'userNik' },
  { title: 'Role', key: 'roleName', align: 'center' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
];

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'new':
      dialogData.title = 'New User';
      dialogData.subtitle = 'Create a new user';
      break;
    case 'edit':
      dialogData.title = 'Edit User';
      dialogData.subtitle = 'Edit user details';
      selected.value = item;
      break;
    case 'uploadSignature':
      dialogData.title = 'Upload Signature';
      dialogData.subtitle = 'Upload a new signature for the user';
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
  const res = await store.fetchData({}, '/users', 'GET');
  users.value = res.data;
  users.value = users.value.map((u) => ({
    ...u,
    no: users.value.indexOf(u) + 1,
  }));
};

const deleteUser = async () => {
  try {
    await store.fetchData({}, `/users/${selected.value.userId}`, 'DELETE');
    refresh();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
