<template>
  <div>
    <table class="inspectionHeader">
      <thead>
        <tr>
          <th>Register Number</th>
          <td class="text-center">{{ toolData.regNumber }}</td>
          <th>Rank</th>
          <td class="text-center">{{ toolData.rank }}</td>
          <th class="text-center">Judgement</th>
        </tr>
        <tr>
          <th>Type</th>
          <td class="text-center">{{ toolData.type }}</td>
          <th>Tool Name</th>
          <td class="text-center">{{ toolData.toolName }}</td>
          <td
            :class="`text-center text-h3 ${inspections.judgement == 1 ? 'text-green' : inspections.judgement == 0 ? 'text-red' : ''}`"
            rowspan="2"
          >
            {{
              inspections.judgement == 1
                ? 'OK'
                : inspections.judgement == 0
                  ? 'NG'
                  : ''
            }}
          </td>
        </tr>
        <tr>
          <th>Location/Place</th>
          <td class="text-center" colspan="3">
            {{ toolData.toolData.find((data) => data.headerId == 26).value }}
          </td>
        </tr>
        <tr>
          <th class="text-center" colspan="2">Tool Image</th>
          <th class="text-center" colspan="3">Inspection</th>
        </tr>
        <tr>
          <td class="text-center" colspan="2" :rowspan="1 + methodsLength">
            <div class="pa-4 w-100 d-flex justify-center align-center">
              <v-img
                width="400"
                :src="imageUrl == null ? defaultImage : imageUrl"
              ></v-img>
            </div>
          </td>
          <th>Inspection Items</th>
          <th>Check Methods</th>
          <th>Result</th>
        </tr>
        <template v-for="(item, index) in insItems" :key="index">
          <tr v-for="(method, mIndex) in item.methods" :key="mIndex">
            <td
              class="text-no-wrap"
              :rowspan="item.methods.length"
              v-if="mIndex == 0"
            >
              {{ item.label }}
            </td>
            <td>
              {{ method.label }}
            </td>
            <td
              width="300px"
              :class="` ${inspections.methods.find((m) => m.methodId == method.methodId)?.judgement ? 'bg-green-lighten-4' : 'bg-pink-lighten-4'} text-center`"
            >
              <inspection-comp
                :unit="method.unit"
                :logic="method.logic"
                :standards="JSON.parse(method.standard)"
                @update="updateInspection($event, method.methodId)"
              ></inspection-comp>
            </td>
          </tr>
        </template>
        <tr>
          <th colspan="5">
            <v-btn
              :disabled="inspections.methods.some((m) => m.value === '')"
              v-if="inspections.judgement != 0"
              @click="openDialog('verify')"
              block=""
              variant="outlined"
              rounded="pill"
            >
              {{ inspections.judgement == 0 ? 'Report NG' : 'Submit' }}
            </v-btn>
            <v-btn
              v-else
              :disabled="inspections.methods.some((m) => m.value === '')"
              @click="openDialog('NG')"
              block=""
              variant="outlined"
              rounded="pill"
              :color="inspections.judgement == 0 ? 'error' : 'success'"
            >
              {{ inspections.judgement == 0 ? 'Report NG' : 'Submit' }}
            </v-btn>
          </th>
        </tr>
      </thead>
    </table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      max-width="650px"
      transition="dialog-transition"
    >
      <v-card>
        <template #text v-if="inspections.judgement != 0">
          <!-- content -->
          <div class="d-flex align-center justify-center flex-column pa-4">
            <h1 class="text-h5">Verify Inspection</h1>
            <p>Are you sure you want to submit this inspection report?</p>
            <v-icon color="warning" size="120">mdi-help-circle-outline</v-icon>
          </div>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
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
            <v-col cols="6">
              <v-btn variant="outlined" rounded="pill" block @click="submit">
                Proceed
              </v-btn>
            </v-col>
          </v-row>
        </template>
        <template #text v-else>
          <daily-abnormal-report
            :tool-data="toolData"
            @reportSubmitted="submit"
          ></daily-abnormal-report>
        </template>
        <template #append v-if="inspections.judgement == 0">
          <v-btn flat icon class="ma-2" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title v-if="inspections.judgement == 0">
          Daily Abnormal Report
        </template>
        <template #subtitle v-if="inspections.judgement == 0">
          Please fill out the form below to report any abnormalities found
          during the inspection.
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import defaultImage from '@/assets/images/engineer.png';
import moment from 'moment';

const store = useAppStore();
const props = defineProps(['toolData']);
const emit = defineEmits(['submitSuccess']);
const dialog = ref(false);
const selected = ref(null);
const formData = reactive({});
const imageUrl = ref(null);
const insItems = ref([]);
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});
const methodsLength = ref(0);

const inspections = ref({
  toolId: props.toolData.toolId,
  inspectionDate: moment().format('YYYY-MM-DD'),
  inspector: store.userData['userId'],
  judgement: 0,
  methods: [],
});

const openDialog = (key, item) => {
  switch (key) {
    case 'verify':
      break;
    case 'edit':
      selected.value = item;
      break;
    case 'delete':
      selected.value = item;
      return;
  }
  dialog.value = true;
};

const updateInspection = (value, methodId) => {
  const method = inspections.value.methods.find((m) => m.methodId == methodId);
  if (method) {
    method.value = value.value;
    method.judgement = value.judgement ? 1 : 0;
  }
  const ngCount = inspections.value.methods.filter(
    (m) => m.judgement == 0
  ).length;
  inspections.value.judgement = ngCount > 0 ? 0 : 1;
};

const refresh = async () => {
  await getImage();
  store
    .fetchData({}, `/inspections/${props.toolData.toolId}/insitems`)
    .then(async (response) => {
      const data = response.data || [];
      let n = 0;
      insItems.value = await Promise.all(
        data.map(async (item) => {
          const methodsRes = await store.fetchData(
            {},
            `/inspections/${item.insId}/methods`
          );
          item.methods = methodsRes.data || [];
          n += methodsRes.data.length;
          let mymethod = await Promise.all(
            item.methods.map(async (method) => {
              return {
                methodId: method.methodId,
                value: '',
                judgement: 0,
              };
            })
          );
          inspections.value.methods.push(...mymethod);
          return item;
        })
      );
      setTimeout(() => {
        methodsLength.value = n;
      }, 100);
      methodsLength.value = n;
    });
};
const getImage = async () => {
  try {
    const response = await store.fetchData(
      null,
      `/tools/image/${props.toolData.toolId}`,
      'GET'
    );
    if (response) {
      imageUrl.value = response.data
        ? `data:image/png;base64,${response.data}`
        : null;
    } else {
      imageUrl.value = null;
    }
  } catch (error) {
    console.log(error);
    store.myAlert.fire(error);
  }
};

const submit = async (payload) => {
  try {
    const response = await store.fetchData(
      {
        data: inspections.value,
        abnormalityReport: inspections.value.judgement == 0 ? payload : null,
      },
      `/inspections/daily/${props.toolData.toolId}`,
      'POST'
    );

    if (response) {
      store.myAlert.fire({
        icon: 'success',
        title: 'Inspection Submitted',
        text: 'Successfully submitted inspection data.',
      });
      emit('submitSuccess');
    }
  } catch (error) {
    console.log(error);
    store.myAlert.fire(error);
  }
};

onBeforeMount(() => {
  refresh();
});
</script>
