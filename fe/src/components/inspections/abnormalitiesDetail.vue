<template>
  <v-row>
    <v-col cols="12">
      <table class="inspectionHeader">
        <thead>
          <tr>
            <th colspan="4" class="text-center bg-primary">PRODUCTION</th>
          </tr>
          <tr>
            <th>Abnormality Type</th>
            <td class="text-start">
              <v-checkbox-btn
                readonly
                v-model="abnormalityData.type"
                :true-value="1"
                label="Daily Finding"
              />
            </td>
            <td class="text-start" colspan="2">
              <v-checkbox-btn
                readonly
                v-model="abnormalityData.type"
                :true-value="2"
                label="Calibration Finding"
              />
            </td>
          </tr>
          <tr>
            <th>Finding Date</th>
            <td>{{ abnormalityData.findingDate }}</td>
            <th>Location</th>
            <td>
              {{ abnormalityData.location ? abnormalityData.location : 'N/A' }}
            </td>
          </tr>
          <tr>
            <th>Tool Name</th>
            <td>{{ abnormalityData.toolName }}</td>
            <th>Registration Number</th>
            <td>{{ abnormalityData.regNumber }}</td>
          </tr>
          <tr>
            <th>User Department</th>
            <td>{{ abnormalityData.userDepartment }}</td>
            <th>Last Calibration Date</th>
            <td>{{ abnormalityData.lastCalibrationDate }}</td>
          </tr>
          <tr>
            <th>Finding Description</th>
            <td colspan="3">{{ abnormalityData.findingDescription }}</td>
          </tr>
          <tr>
            <th>Cause</th>
            <td colspan="3">
              <v-textarea
                :disabled="abnormalityData.type == 2"
                :error-messages="v$.cause.$errors.map((e) => e.$message)"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
                v-model="formdata.cause"
              />
            </td>
          </tr>
          <tr>
            <th>Taken Actions</th>
            <td colspan="3">
              <v-textarea
                :disabled="abnormalityData.type == 2"
                :error-messages="v$.tempActions.$errors.map((e) => e.$message)"
                v-model="formdata.tempActions"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
              />
            </td>
          </tr>

          <tr>
            <th class="text-no-wrap">PIC</th>
            <td>{{ abnormalityData.reporterName }}</td>
            <th class="text-no-wrap">GL/SPV/MGR</th>
            <td
              :class="{ 'bg-pink-lighten-4': !abnormalityData.confirmatorName }"
            >
              {{ abnormalityData.confirmatorName }}
            </td>
          </tr>
          <tr>
            <th colspan="4" class="text-center bg-primary">QUALITY CONTROL</th>
          </tr>
          <tr>
            <th>Action to Products</th>
            <td colspan="3">
              <v-textarea
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
              />
            </td>
          </tr>
          <tr>
            <th rowspan="2">Action to Measurement Tools</th>
            <td colspan="3">
              <div class="d-flex">
                <v-checkbox-btn label="Disposal" inline=""></v-checkbox-btn>
                <v-checkbox-btn label="Repaired" inline=""></v-checkbox-btn>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <v-textarea
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
              />
            </td>
          </tr>
          <tr>
            <th class="text-no-wrap">PIC</th>
            <td>{{ abnormalityData.reporterName }}</td>
            <th class="text-no-wrap">GL/SPV/MGR</th>
            <td
              :class="{ 'bg-pink-lighten-4': !abnormalityData.confirmatorName }"
            >
              {{ abnormalityData.confirmatorName }}
            </td>
          </tr>

          <tr>
            <th colspan="4" class="text-center bg-primary">PRODUCTION</th>
          </tr>
          <tr>
            <th>Confirmation</th>
            <td colspan="3">
              <v-textarea
                label="note"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
              />
            </td>
          </tr>

          <tr>
            <th colspan="4" class="text-center bg-primary">QUALITY CONTROL</th>
          </tr>
          <tr>
            <th>Confirmation</th>
            <td colspan="3">
              <v-textarea
                label="note"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
              />
            </td>
          </tr>
        </thead>
      </table>
    </v-col>
    <v-col cols="12">
      <v-btn @click="submit" variant="outlined" rounded="pill" block
        >Response</v-btn
      >
    </v-col>
  </v-row>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps(['abnormalityData']);
const emits = defineEmits(['submitted']);
const store = useAppStore();
const dialog = ref(false);
const formdata = reactive({
  id: props.abnormalityData.id || null,
  cause: props.abnormalityData.cause || '',
  tempActions: props.abnormalityData.actions || '',
  confirmator: store.userData.userId,
});

const formData2 = reactive({});

const rules = {
  cause: {
    req: required,
  },
  tempActions: {
    req: required,
  },
};

const v$ = useVuelidate(rules, formdata);

const submit = async () => {
  try {
    const valid = await v$.value.$validate();
    if (!valid) {
      throw {
        title: 'Validation Error',
        icon: 'error',
        text: 'Please fill in all required fields',
      };
    }

    await store.fetchData(
      formdata,
      '/inspections/abnormalities/confirm',
      'POST'
    );
    emits('submitted');
    store.myAlert.fire({
      title: 'Success',
      icon: 'success',
      text: 'Abnormality report confirmed successfully',
    });
  } catch (error) {
    store.myAlert.fire(error);
  }
};
</script>
