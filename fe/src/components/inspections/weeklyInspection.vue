<template>
  <div>
    <table class="inspectionHeader">
      <thead>
        <tr>
          <th>Register Number</th>
          <td class="text-center">{{ inspectionsData.regNumber }}</td>
          <th>Rank</th>
          <td class="text-center">{{ inspectionsData.rankName }}</td>
        </tr>

        <tr>
          <th>Type</th>
          <td class="text-center">{{ inspectionsData.typeName }}</td>
          <th>Tool Name</th>
          <td class="text-center">{{ inspectionsData.toolName }}</td>
        </tr>

        <tr>
          <th>Location/Place</th>
          <td class="text-center" colspan="3">
            {{ inspectionsData.location }}
          </td>
        </tr>
        <tr>
          <th>Check Period</th>
          <td colspan="3">
            Start: {{ moment(dateRange[0]).format('dddd, DD/MM/YYYY') }} <br />
            End:
            {{ moment(dateRange[1]).format('dddd, DD/MM/YYYY') }}
          </td>
        </tr>
      </thead>
    </table>
    <table class="mt-5 inspectionHeader">
      <thead>
        <tr>
          <th rowspan="2">Check Items</th>
          <th rowspan="2">Inspection Methods</th>
          <th colspan="7" class="text-center">Date</th>
        </tr>
        <tr>
          <th class="text-center" v-for="(date, index) in dates" :key="index">
            {{ date }}
          </th>
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
              :placeholder="getData(date, method.methodId)"
              v-for="(date, dIndex) in dates"
              :key="dIndex"
              :class="`text-center text-no-wrap ${getData(date, method.methodId).judgement == 0 ? 'bg-pink-lighten-4' : getData(date, method.methodId).judgement == 1 ? 'bg-green-lighten-4' : ''}`"
            >
              <div v-if="getData(date, method.methodId).dataType">
                <v-icon
                  v-if="getData(date, method.methodId).dataType == 'bool'"
                  :color="
                    getData(date, method.methodId).judgement == 1
                      ? 'green'
                      : getData(date, method.methodId).judgement == 0
                        ? 'red'
                        : ''()
                  "
                >
                  {{
                    getData(date, method.methodId).judgement == 1
                      ? 'mdi-circle-outline'
                      : getData(date, method.methodId).judgement == 0
                        ? 'mdi-close'
                        : 'mdi-minus'
                  }}
                </v-icon>
                <div v-else>
                  {{ getData(date, method.methodId).value }}
                </div>
              </div>
              <div v-else>
                <v-icon>
                  {{ getData(date, method.methodId).unused ? 'mdi-minus' : '' }}
                </v-icon>
              </div>
            </td>
          </tr>
        </template>
        <tr>
          <th colspan="9">
            <v-btn
              v-if="!localData.inspections.some((ins) => ins.judgement == 0)"
              variant="outlined"
              rounded="pill"
              block
              @click="verify = true"
            >
              Confirm
            </v-btn>
            <v-btn
              @click="abnormalitiesDialog = true"
              v-else
              variant="outlined"
              rounded="pill"
              block
              color="error"
            >
              Review Abnormalities
            </v-btn>
          </th>
        </tr>
      </thead>
    </table>
    <v-dialog
      v-model="verify"
      scrollable
      persistent
      :overlay="false"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card class="text-center">
        <v-card-title>Confirm Inspection</v-card-title>
        <v-card-text>
          <p>Are you sure you want to confirm this inspection?</p>
          <v-icon size="120" color="warning">mdi-help-circle-outline</v-icon>
          <v-row>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col cols="6">
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="verify = false"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn variant="outlined" rounded="pill" block @click="confirm">
                Proceed
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="abnormalitiesDialog"
      scrollable
      persistent
      :overlay="false"
      max-width="700"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-text class="text-center">
          <h1 class="text-h5">Abnormalities Detected</h1>
          <p class="my-2">
            There are abnormalities detected in the inspection data. <br />
            Please review the abnormalities before confirming the inspection.
          </p>
          <div class="my-2">
            <v-divider></v-divider>
          </div>
          <v-row>
            <v-col cols="4">
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="abnormalitiesDialog = false"
                >Cancel</v-btn
              >
            </v-col>
            <v-col cols="4">
              <v-btn
                color="primary"
                variant="outlined"
                rounded="pill"
                block
                @click="$router.push('/inspections/abnormalities')"
                >Review</v-btn
              >
            </v-col>
            <v-col cols="4">
              <v-btn
                variant="outlined"
                rounded="pill"
                block
                @click="
                  verify = true;
                  abnormalitiesDialog = false;
                "
                color="pink"
              >
                Confirm Anyway
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import moment from 'moment';
const store = useAppStore();
const props = defineProps(['inspectionsData', 'dateRange']);
const localData = ref({ ...toRaw(props.inspectionsData) });
const insItems = ref([]);
const methodsLength = ref(0);
const dates = ref([]);
const verify = ref(false);
const emits = defineEmits(['updated']);
const abnormalities = ref([]);
const abnormalitiesDialog = ref(false);
const abnormalitiesDetailDialog = ref(false);

const generateDates = () => {
  const start = moment(props.dateRange[0]);
  const end = moment(props.dateRange[1]);
  const dateArray = [];
  let currentDate = start;

  while (currentDate <= end) {
    dateArray.push(currentDate.format('DD'));
    currentDate = currentDate.add(1, 'days');
  }
  dates.value = dateArray;
  console.log(dates.value);
};

const refresh = async () => {
  generateDates();
  const toolid = props.inspectionsData.toolId;
  store
    .fetchData({}, `/inspections/${toolid}/insitems`)
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
          return item;
        })
      );
      setTimeout(() => {
        methodsLength.value = n;
      }, 100);
      methodsLength.value = n;
    });
};

const getData = (date, methodId) => {
  const item = localData.value.inspections.find(
    (ins) => moment(ins.inspectionDate).format('DD') == date
  );
  if (item) {
    const method = item.methods.find((m) => m.methodId == methodId);
    return method
      ? {
          value: `${method.value} ${method.unit || ''}`,
          judgement: method.judgement,
          dataType: method.logic == 1 || method.logic == 16 ? 'bool' : 'text',
        }
      : item;
  }
  return '';
};

onMounted(() => {
  refresh();
});

const confirm = async () => {
  try {
    const data = {
      confirmationDate: moment().format('YYYY-MM-DD'),
      confirmator: store.userData.userId,
      toolId: localData.value.toolId,
      dateRangeStart: moment(props.dateRange[0]).format('YYYY-MM-DD'),
      dateRangeEnd: moment(props.dateRange[1]).format('YYYY-MM-DD'),
    };
    await store.fetchData(data, '/inspections/weekly/confirm', 'POST');
    store.myAlert.fire({
      icon: 'success',
      title: 'Inspection confirmed successfully',
    });
    emits('updated');
  } catch (error) {
    console.log(error);
    store.myAlert.fire(error);
  }
};

const reviewAbnormalities = () => {
  // Logic to review abnormalities
  let toolId = localData.value.toolId;
  let startDate = moment(props.dateRange[0]).format('YYYY-MM-DD');
  let endDate = moment(props.dateRange[1]).format('YYYY-MM-DD');

  // Fetch abnormalities data
  store
    .fetchData(
      { toolId, startDate, endDate },
      '/inspections/abnormalities',
      'POST'
    )
    .then((response) => {
      // Handle abnormalities data
      abnormalities.value = response.data || [];
      abnormalitiesDialog.value = true;
    })
    .catch((error) => {
      console.error('Error fetching abnormalities:', error);
    });
};
</script>
