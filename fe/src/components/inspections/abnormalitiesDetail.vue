<template>
  <v-row>
    <v-col cols="12">
      <table class="inspectionHeader">
        <thead>
          <tr>
            <th colspan="4" class="text-center bg-primary">USER DEPT</th>
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
                :readonly="phase > 1"
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
                :readonly="phase > 1"
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
            <td colspan="4">
              <v-btn
                @click="submit"
                variant="outlined"
                rounded="pill"
                block
                :disabled="
                  phase != 1 ||
                  abnormalityData.confirmator != null ||
                  signIds.signPermissions_3 != 1
                "
                >Response</v-btn
              >
            </td>
          </tr>
          <tr>
            <th colspan="4" class="text-center bg-primary">QUALITY CONTROL</th>
          </tr>
          <tr>
            <th>Action to Products</th>
            <td colspan="3">
              <v-textarea
                :readonly="formData2.qcPICName != ''"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
                v-model="formData2.actToProducts"
                :error-messages="
                  v$2.actToProducts.$errors.map((e) => e.$message)
                "
              />
            </td>
          </tr>
          <tr>
            <th rowspan="2">Action to Measurement Tools</th>
            <td colspan="3">
              <div class="d-flex">
                <v-checkbox-btn
                  label="Disposal"
                  inline=""
                  value="disposal"
                  v-model="formData2.actToTools"
                  :error-messages="
                    v$2.actToTools.$errors.map((e) => e.$message)
                  "
                ></v-checkbox-btn>
                <v-checkbox-btn
                  label="Repaired"
                  inline=""
                  value="repaired"
                  v-model="formData2.actToTools"
                  :error-messages="
                    v$2.actToTools.$errors.map((e) => e.$message)
                  "
                ></v-checkbox-btn>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <v-textarea
                :readonly="formData2.qcPICName != ''"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
                v-model="formData2.qcActionNote"
                :error-messages="
                  v$2.qcActionNote.$errors.map((e) => e.$message)
                "
              />
            </td>
          </tr>
          <tr>
            <th class="text-no-wrap">PIC</th>
            <td>
              {{
                formData2.qcPICName ||
                (formData2.qcPIC ? 'Signed' : 'Not signed')
              }}
            </td>
            <th class="text-no-wrap">GL/SVP/MGR</th>
            <td>
              {{
                formData2.qcMgrName ||
                (formData2.qcMgr ? 'Signed' : 'Not signed')
              }}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <v-btn
                @click="submit('pic')"
                variant="outlined"
                rounded="pill"
                block
                :disabled="
                  phase != 2 ||
                  formData2.qcPIC != null ||
                  signIds.signPermissions_1 != 1
                "
              >
                Sign as PIC
              </v-btn>
            </td>
            <td colspan="2">
              <v-btn
                @click="submit('mgr')"
                variant="outlined"
                rounded="pill"
                block
                :disabled="
                  phase != 2 ||
                  formData2.qcMgr != null ||
                  formData2.qcPIC == null ||
                  signIds.signPermissions_2 != 1
                "
              >
                Sign as GL/SVP/MGR
              </v-btn>
            </td>
          </tr>
          <tr>
            <th colspan="4" class="text-center bg-primary">USER DEPT</th>
          </tr>
          <tr>
            <th>Confirmation</th>

            <td colspan="3">
              <v-textarea
                :readonly="formData3.prodConfirmatorName != ''"
                label="note"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
                v-model="formData3.prodConfirmNote"
                :error-messages="
                  v$3.prodConfirmNote.$errors.map((e) => e.$message)
                "
              />
            </td>
          </tr>
          <tr>
            <th class="text-no-wrap">Dep. Pengguna GL/SV/Mgr</th>
            <td colspan="3">
              {{
                formData3.prodConfirmatorName ||
                (formData3.prodConfirmator ? 'Signed' : 'Not signed')
              }}
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <v-btn
                @click="submit"
                variant="outlined"
                rounded="pill"
                block
                :disabled="
                  phase != 3 ||
                  formData3.prodConfirmator != null ||
                  signIds.signPermissions_3 != 1
                "
              >
                Response
              </v-btn>
            </td>
          </tr>
          <tr>
            <th colspan="4" class="text-center bg-primary">QUALITY CONTROL</th>
          </tr>
          <tr>
            <th>Confirmation</th>
            <td colspan="3">
              <v-textarea
                :readonly="formData4.qcConfirmatorName != ''"
                label="note"
                hide-details
                rows="3"
                variant="outlined"
                rounded="lg"
                density="compact"
                no-resize
                v-model="formData4.qcConfirmNote"
                :error-messages="
                  v$4.qcConfirmNote.$errors.map((e) => e.$message)
                "
              />
            </td>
          </tr>
          <tr>
            <th class="text-no-wrap">Confirmator</th>
            <td>
              {{
                formData4.qcConfirmatorName ||
                (formData4.qcConfirmator ? 'Signed' : 'Not signed')
              }}
            </td>
            <th class="text-no-wrap">GL/SVP/MGR</th>
            <td>
              {{
                formData4.qcMgr4Name ||
                (formData4.qcMgr4 ? 'Signed' : 'Not signed')
              }}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <v-btn
                @click="submit('confirmator')"
                variant="outlined"
                rounded="pill"
                block
                :disabled="
                  phase != 4 ||
                  formData4.qcConfirmator != null ||
                  signIds.signPermissions_1 != 1
                "
              >
                Sign as Confirmator
              </v-btn>
            </td>
            <td colspan="2">
              <v-btn
                @click="submit('mgr')"
                variant="outlined"
                rounded="pill"
                block
                :disabled="
                  phase != 4 ||
                  formData4.qcConfirmator == null ||
                  formData4.qcMgr4 != null ||
                  signIds.signPermissions_2 != 1
                "
              >
                Sign as GL/SVP/MGR
              </v-btn>
            </td>
          </tr>
        </thead>
      </table>
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

const phase = ref(1);

const signIds = ref({
  signPermissions_1: 0,
  signPermissions_2: 0,
  signPermissions_3: 0,
});

const formdata = reactive({
  id: props.abnormalityData.id || null,
  cause: props.abnormalityData.cause || '',
  tempActions: props.abnormalityData.actions || '',
  confirmator: store.userData.userId,
});

const formData2 = reactive({
  abId: props.abnormalityData.id || null,
  actToProducts: '',
  actToTools: [],
  qcActionNote: '',
  qcPIC: null,
  qcMgr: null,
  qcPICName: '',
  qcMgrName: '',
});

const formData3 = reactive({
  abId: props.abnormalityData.id || null,
  prodConfirmNote: '',
  prodConfirmator: null,
  prodConfirmatorName: '',
});

const formData4 = reactive({
  abId: props.abnormalityData.id || null,
  qcConfirmNote: '',
  qcMgr4: null,
  qcConfirmator: null,
  qcMgr4Name: '',
  qcConfirmatorName: '',
});

const rules2 = {
  actToProducts: {
    req: required,
  },
  actToTools: {
    req: required,
  },
  qcActionNote: {
    req: required,
  },
};

const rules3 = {
  prodConfirmNote: {
    req: required,
  },
};

const rules4 = {
  qcConfirmNote: {
    req: required,
  },
};

const rules = {
  cause: {
    req: required,
  },
  tempActions: {
    req: required,
  },
};

const v$ = useVuelidate(rules, formdata);
const v$2 = useVuelidate(rules2, formData2);
const v$3 = useVuelidate(rules3, formData3);
const v$4 = useVuelidate(rules4, formData4);

const submit = async (phaseAction) => {
  try {
    switch (phase.value) {
      case 1:
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
        store.myAlert.fire({
          title: 'Success',
          icon: 'success',
          text: 'Abnormality report confirmed successfully',
        });
        break;
      case 2:
        // Validate form when PIC signs (first signer who fills data)
        if (phaseAction === 'pic') {
          const valid2 = await v$2.value.$validate();
          if (!valid2) {
            throw {
              title: 'Validation Error',
              icon: 'error',
              text: 'Please fill in all required fields',
            };
          }
        }

        const payload2 = {
          abId: formData2.abId,
          actToProducts: formData2.actToProducts,
          actToTools: formData2.actToTools,
          qcActionNote: formData2.qcActionNote,
        };

        if (phaseAction === 'pic') {
          payload2.qcPIC = store.userData.userId;
        } else if (phaseAction === 'mgr') {
          payload2.qcMgr = store.userData.userId;
        }

        await store.fetchData(
          payload2,
          '/inspections/abnormalities/phase2',
          'POST'
        );
        store.myAlert.fire({
          title: 'Success',
          icon: 'success',
          text: 'QC action confirmed successfully',
        });

        // Refresh data after submission
        await getPhase();
        break;
      case 3:
        const valid3 = await v$3.value.$validate();
        if (!valid3) {
          throw {
            title: 'Validation Error',
            icon: 'error',
            text: 'Please fill in all required fields',
          };
        }

        formData3.prodConfirmator = store.userData.userId;

        await store.fetchData(
          formData3,
          '/inspections/abnormalities/phase3',
          'POST'
        );
        store.myAlert.fire({
          title: 'Success',
          icon: 'success',
          text: 'Production confirmation submitted successfully',
        });
        break;
      case 4:
        // Validate form when Confirmator signs (first signer who fills data)
        if (phaseAction === 'confirmator') {
          const valid4 = await v$4.value.$validate();
          if (!valid4) {
            throw {
              title: 'Validation Error',
              icon: 'error',
              text: 'Please fill in all required fields',
            };
          }
        }

        const payload4 = {
          abId: formData4.abId,
          qcConfirmNote: formData4.qcConfirmNote,
        };

        if (phaseAction === 'confirmator') {
          payload4.qcConfirmator = store.userData.userId;
        } else if (phaseAction === 'mgr') {
          payload4.qcMgr = store.userData.userId;
        }

        await store.fetchData(
          payload4,
          '/inspections/abnormalities/phase4',
          'POST'
        );
        store.myAlert.fire({
          title: 'Success',
          icon: 'success',
          text: 'QC confirmation submitted successfully',
        });

        // Refresh data after submission
        await getPhase();
        break;
    }

    emits('submitted');
  } catch (error) {
    store.myAlert.fire(error);
  }
};

const getPhase = async () => {
  try {
    const response = await store.fetchData(
      {},
      `/inspections/abnormalities/getPhase/${props.abnormalityData.id}`
    );

    const data = response.data;

    // Populate form data dari response
    if (data) {
      formData2.actToProducts = data.actToProducts || '';
      formData2.actToTools = data.actToTools ? data.actToTools.split(',') : [];
      formData2.qcActionNote = data.qcActionNote || '';
      formData2.qcPIC = data.qcPIC || null;
      formData2.qcMgr = data.qcMgr || null;
      formData2.qcPICName = data.qcPICName || '';
      formData2.qcMgrName = data.qcMgrName || '';

      formData3.prodConfirmNote = data.prodConfirmNote || '';
      formData3.prodConfirmator = data.prodConfirmator || null;
      formData3.prodConfirmatorName = data.prodConfirmatorName || '';

      formData4.qcConfirmNote = data.qcConfirmNote || '';
      formData4.qcMgr4 = data.qcMgr4 || null;
      formData4.qcConfirmator = data.qcConfirmator || null;
      formData4.qcMgr4Name = data.qcMgr4Name || '';
      formData4.qcConfirmatorName = data.qcConfirmatorName || '';
    }

    // Check phase dari yang tertinggi ke terendah
    if (data && data.qcMgr4 && data.qcConfirmator) {
      phase.value = 5; // Phase 4 selesai semua
    } else if (data && data.qcConfirmator && !data.qcMgr4) {
      phase.value = 4; // Confirmator sudah, tunggu GL/Manager
    } else if (data && data.prodConfirmator && data.qcConfirmNote) {
      phase.value = 4; // Prod confirm selesai, mulai QC final confirmation
    } else if (data && data.prodConfirmator) {
      phase.value = 4; // Prod confirm selesai, belum isi data phase 4
    } else if (data && data.qcPIC && data.qcMgr) {
      phase.value = 3; // QC phase 2 selesai, lanjut prod confirmation
    } else if (data && data.qcPIC && !data.qcMgr) {
      phase.value = 2; // QC PIC sudah, tunggu Manager
    } else if (props.abnormalityData.confirmator != null) {
      phase.value = 2; // Phase 1 selesai, mulai phase 2
    } else {
      phase.value = 1;
    }
  } catch (error) {
    console.log(error);
  }
};

const getSignPermissions = async () => {
  try {
    const response = await store.fetchData(
      {},
      `/roles/${store.userData.roleId}/signPermissions`
    );
    const data = response.data;
    signIds.value.signPermissions_1 = data.signPermissions_1;
    signIds.value.signPermissions_2 = data.signPermissions_2;
    signIds.value.signPermissions_3 = data.signPermissions_3;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getPhase();
  getSignPermissions();
});
</script>
