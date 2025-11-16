<template>
  <v-app theme="light">
    <router-view />
    <v-dialog
      v-model="store.preload"
      scrollable
      fullscreen
      persistent
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card>
        <div class="d-flex align-center justify-center w-100 h-100">
          <v-progress-circular
            indeterminate
            size="300"
            width="10"
            color="primary"
          >
            <div
              class="d-flex justify-center align-center w-100 h-100 flex-column"
            >
              <v-img :src="logo" contain height="200" width="200"></v-img>
            </div>
          </v-progress-circular>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { useAppStore } from './stores/app';
import logo from './assets/images/softpren.png';

//
const store = useAppStore();
</script>
