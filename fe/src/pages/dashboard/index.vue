<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title>
            <h1>Welcome to Dashboard</h1>
          </v-card-title>
          <v-card-text>
            <p>Selamat datang di dashboard aplikasi MTCS v3</p>
            <div class="mt-4">
              <v-chip color="primary" class="mr-2">
                User: {{ appStore.userData?.userName || 'N/A' }}
              </v-chip>
              <v-chip color="secondary">
                Role: {{ appStore.userData?.roleName || 'N/A' }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>API Status</v-card-title>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
              <span>Connected to: {{ appStore.apiServer }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Debug Info</v-card-title>
          <v-card-text>
            <div v-if="appStore.isDebugMode">
              <v-icon color="warning" class="mr-2">mdi-bug</v-icon>
              <span>Debug mode is enabled</span>
            </div>
            <div v-else>
              <v-icon color="success" class="mr-2">mdi-shield-check</v-icon>
              <span>Production mode</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
</script>
