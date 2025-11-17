<template>
  <v-main>
    <v-app-bar app>
      <template #prepend>
        <v-btn flat icon @click="menuDrawer = !menuDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <template #title>{{}}</template>
      <template #append>
        <v-btn flat icon @click="setupDrawer = !setupDrawer">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-navigation-drawer temporary v-model="setupDrawer" app location="right">
      <v-list class="ma-4" color="primary">
        <v-list-item
          class="my-2"
          elevation="2"
          rounded="lg"
          :active="item.path === $router.currentRoute.value.path"
          v-for="(item, index) in store.setupList"
          :key="index"
          :to="item.path"
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <template #title>
            {{ item.title }}
          </template>
        </v-list-item>
      </v-list>
      <template #append>
        <v-list>
          <v-list-item @click="logoutDialog = true">
            <template #prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <template #title>Logout</template>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-navigation-drawer
      width="370"
      app
      location="left"
      temporary=""
      v-model="menuDrawer"
    >
      <template #prepend>
        <v-card class="mx-4 mt-4 mb-1" outlined>
          <template #prepend>
            <v-img width="40" src="@/assets/images/softpren.png"></v-img>
          </template>
          <template #title> Welcome </template>
          <template #subtitle>
            <v-divider class="mb-2"></v-divider>
            {{ store.userData['userName'] }} -
            {{ store.userData['roleName'] }}
          </template>
        </v-card>
        <v-divider class="mt-2 mnb-0"></v-divider>
      </template>
      <v-list class="mx-4 mb-2" color="primary">
        <v-list-item
          class="my-2"
          elevation="2"
          rounded="lg"
          :active="item.path === $router.currentRoute.value.path"
          v-for="(item, index) in menuList"
          :key="index"
          :to="item.path"
        >
          <!-- <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template> -->
          <template #title>
            {{ item.title }}
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-card class="ma-4">
      <template #text>
        <router-view />
      </template>
    </v-card>

    <v-dialog
      v-model="logoutDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <template #title>Logout</template>
        <template #text>
          <p>Are you sure you want to logout?</p>
        </template>
        <template #actions>
          <v-btn @click="logoutDialog = false">Cancel</v-btn>
          <v-btn @click="logout">Logout</v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script setup>
import { useAppStore } from '@/stores/app';
import router from '@/router';

const drawer = ref(false);
const setupDrawer = ref(false);
const menuDrawer = ref(false);
const store = useAppStore();
const logoutDialog = ref(false);
const menuList = ref(
  store.menuList.filter((i) => store.userData['access'].includes(i.path))
);

const logout = () => {
  store.logout().then(() => {
    router.push('/');
  });
};
</script>
