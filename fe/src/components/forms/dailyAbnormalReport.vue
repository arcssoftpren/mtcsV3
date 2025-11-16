<template>
  <div>
    <table class="inspectionHeader mt-4 text-sm-body-2">
      <thead>
        <tr>
          <th>Finding Date</th>
          <td class="text-center">{{ moment().format('DD/MM/YYYY') }}</td>
          <th>Location</th>
          <td class="text-center">{{ toolData.location }}</td>
        </tr>
        <tr>
          <th>Tool Name</th>
          <td class="text-center">
            {{ toolData.toolName }}
          </td>
          <th>Register Number</th>
          <td class="text-center">
            {{ toolData.regNumber }}
          </td>
        </tr>
        <tr>
          <th colspan="2">Last Calibration Date</th>
          <td class="text-center" colspan="2">
            {{ toolData.lastCalibrationDate }}
          </td>
        </tr>
        <tr>
          <td colspan="4"><small>Please describe the issue:</small></td>
        </tr>
        <tr>
          <th>User Department</th>
          <td colspan="3">
            <v-text-field
              hide-details=""
              variant="outlined"
              rounded="pill"
              density="compact"
              v-model="formData.userDepartment"
              :error-messages="
                validate.userDepartment.$errors.map((e) => e.$message)
              "
            />
          </td>
        </tr>
        <tr>
          <th>Finding Description</th>
          <td colspan="3">
            <v-textarea
              :error-messages="
                validate.userDepartment.$errors.map((e) => e.$message)
              "
              rows="3"
              no-resize=""
              hide-details=""
              variant="outlined"
              rounded="lg"
              density="compact"
              v-model="formData.findingDescription"
            />
          </td>
        </tr>
        <tr>
          <td colspan="4" class="text-center">
            <v-btn variant="outlined" rounded="pill" block @click="submit"
              >Report</v-btn
            >
          </td>
        </tr>
      </thead>
    </table>
    <v-dialog
      v-model="confirmation"
      scrollable
      persistent
      :overlay="false"
      max-width="800px"
      transition="dialog-transition"
    >
      <v-card>
        <template #text>
          <v-row>
            <v-col cols="12">
              <div class="d-flex align-center justify-center flex-column pa-4">
                <h1 class="text-h5">Confirm Report</h1>
                <p class="text-subtitle-1">
                  Are you sure you want to submit this abnormal report?
                </p>
                <v-icon color="warning" size="120"
                  >mdi-help-circle-outline</v-icon
                >
                <h1 class="text-h5 text-center text-error">
                  Please contact your group leader or supervisor after
                  submission!!
                </h1>
              </div>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="6">
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="confirmation = false"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-btn
                @click="confirm"
                color="error"
                variant="outlined"
                rounded="pill"
                block
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import moment from 'moment';

const props = defineProps(['toolData']);
const emit = defineEmits(['reportSubmitted']);
const confirmation = ref(false);
const store = useAppStore();
const confirmButton = ref(null);
const payload = ref({});
const formData = reactive({
  userDepartment: '',
  findingDescription: '',
});
const structure = {};
const rules = {
  userDepartment: {
    required: helpers.withMessage('This field is required', required),
  },
  findingDescription: {
    required: helpers.withMessage('This field is required', required),
  },
};
const validate = useVuelidate(rules, formData);
const submit = async () => {
  try {
    const valid = await validate.value.$validate();
    if (!valid) {
      throw {
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill out all required fields.',
      };
    }

    payload.value = {
      toolId: props.toolData.toolId,
      findingDate: moment().format('YYYY-MM-DD'),
      userDepartment: formData.userDepartment,
      findingDescription: formData.findingDescription,
      reporter: store.userData.userId,
    };

    confirmation.value = true;
  } catch (error) {
    store.myAlert.fire(error);
  }
};

const confirm = async () => {
  try {
    store.myAlert.fire({
      icon: 'success',
      title: 'Report Submitted',
      text: 'Abnormal report submitted successfully.',
    });
    emit('reportSubmitted', { ...payload.value });
    confirmation.value = false;
    formData.userDepartment = '';
    formData.findingDescription = '';
  } catch (error) {
    store.myAlert.fire(error);
  }
};
</script>
