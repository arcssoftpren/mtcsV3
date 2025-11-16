<template>
  <div>
    <v-toolbar color="transparent">
      <v-toolbar-title> <h1 class="text-h5">Leader Report</h1></v-toolbar-title>

      <v-spacer></v-spacer>
      <v-text-field
        hide-details=""
        variant="outlined"
        rounded="pill"
        density="compact"
        type="month"
        v-model="month"
        label="Select Month"
      />
    </v-toolbar>
    <v-data-table
      :search="search"
      :items="inspections"
      :headers="[
        { title: 'Tool Name', key: 'toolName' },
        { title: 'Register Number', key: 'regNumber' },
        { title: 'Location', key: 'location' },
        { title: 'Actions', key: 'actions', align: 'center' },
      ]"
    >
      <template #top>
        <v-toolbar color="transparent" density="compact">
          <v-btn-toggle
            v-model="selectedWeek"
            class="ma-auto"
            mandatory=""
            variant="outlined"
            rounded="lg"
            color="primary"
          >
            <v-btn
              v-for="(week, index) in weeks"
              :key="index"
              density="compact"
              :value="index"
            >
              Week {{ index + 1 }} <br />
              {{ week[0] }} - {{ week[1] }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
        <v-text-field
          class="mt-2"
          v-model="search"
          variant="outlined"
          rounded="pill"
          density="compact"
          label="Search Tools"
        />
        <v-spacer></v-spacer>
      </template>
      <template #item.actions="{ item }">
        <v-btn
          @click="openDialog('inspect', item)"
          variant="outlined"
          rounded="pill"
          :color="getColor(item)"
          block
        >
          {{
            getColor(item) == 'red' ? 'Abnormality Detected' : 'Check Now'
          }}</v-btn
        >
      </template>
    </v-data-table>
    <v-dialog
      v-model="dialog"
      scrollable
      persistent
      :overlay="false"
      fullscreen
      transition="dialog-transition"
    >
      <v-card>
        <template #append>
          <v-btn @click="dialog = false" flat icon class="mt-2 ms-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #title>{{ dialogData.title }}</template>
        <template #subtitle>{{ dialogData.subtitle }}</template>
        <template #text>
          <!-- content -->
          <weekly-inspection
            @updated="refresh"
            :date-range="[
              moment(startDate, 'MMM Do , YYYY').format('YYYY-MM-DD'),
              moment(endDate, 'MMM Do , YYYY').format('YYYY-MM-DD'),
            ]"
            :inspections-data="selected"
          />
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import moment from 'moment';

const store = useAppStore();
const month = ref(moment().format('YYYY-MM'));
const dialog = ref(false);
const selected = ref(null);
const formData = reactive({});
const inspections = ref([]);
const search = ref('');
const dialogData = reactive({
  key: '',
  title: '',
  subtitle: '',
});

const selectedWeek = ref(null);

const weeks = ref([]);

const startDate = ref(null);
const endDate = ref(null);

function getDateRange() {
  const todayMoment = moment().subtract(7, 'days'); // Mengurangi 1 hari untuk memastikan minggu berjalan
  const currentWeekday = todayMoment.isoWeekday(); // 1 = Monday, 7 = Sunday

  let startDateValue;
  let endDateValue;

  if (currentWeekday === 1) {
    // Jika hari ini Senin, start dari hari ini
    startDateValue = todayMoment.clone();
    endDateValue = todayMoment.clone().isoWeekday(7); // Minggu minggu ini
  } else {
    // Jika bukan Senin, start dari Senin minggu ini
    startDateValue = todayMoment.clone().isoWeekday(1); // Senin minggu ini
    endDateValue = todayMoment.clone().isoWeekday(7); // Minggu minggu ini
  }

  startDate.value = startDateValue.format('MMM Do , YYYY');
  endDate.value = endDateValue.format('MMM Do , YYYY');
}

const openDialog = (key, item) => {
  dialogData.key = key;
  switch (key) {
    case 'inspect':
      selected.value = item;
      dialogData.title = 'Inspect Operator Reports';
      dialogData.subtitle =
        'Please review the reports submitted by operators for this tool.';
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

const getColor = (item) => {
  const reject = item.inspections.filter((i) => i.judgement == 0).length;
  if (reject > 0) return 'red';
};

const refresh = async () => {
  const sdate = moment(startDate.value, 'MMM Do , YYYY').format('YYYY-MM-DD');
  const edate = moment(endDate.value, 'MMM Do , YYYY').format('YYYY-MM-DD');
  const reqData = {
    startDate: sdate,
    endDate: edate,
  };
  console.log(reqData);
  const response = await store.fetchData(
    reqData,
    '/inspections/weekly',
    'POST'
  );
  inspections.value = response.data;
  dialog.value = false;
};

onBeforeMount(() => {
  refresh();
  selectMonth();
});

watch(month, () => {
  selectMonth();
});

watch(selectedWeek, () => {
  if (weeks.value.length > 0) {
    const week = weeks.value[selectedWeek.value];
    startDate.value = moment(week[0]).format('MMM Do , YYYY');
    endDate.value = moment(week[1]).format('MMM Do , YYYY');
    refresh();
    console.log(week);
  }
});

const selectMonth = () => {
  const year = moment(month.value, 'YYYY-MM').year();
  const monthNum = moment(month.value, 'YYYY-MM').month(); // 0-based
  const startOfMonth = moment([year, monthNum, 1]);
  const endOfMonth = moment([year, monthNum]).endOf('month');
  const weeks_ = [];
  let current = startOfMonth.clone().startOf('isoWeek'); // Monday of the week containing the 1st
  while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
    const weekStart = current.format('YYYY-MM-DD');
    const weekEnd = current.clone().endOf('isoWeek').format('YYYY-MM-DD'); // Sunday
    weeks_.push([weekStart, weekEnd]);
    current.add(1, 'week');
  }
  const today = moment().format('YYYY-MM-DD');

  const foundIndex = weeks_.findIndex((week, index) => {
    if (today >= week[0] && today <= week[1]) {
      selectedWeek.value = index;
      startDate.value = moment(week[0]).format('MMM Do , YYYY');
      endDate.value = moment(week[1]).format('MMM Do , YYYY');
      return true;
    }
    return false;
  });
  if (foundIndex === -1 && weeks_.length > 0) {
    // Jika tidak ditemukan, pilih minggu pertama
    selectedWeek.value = 0;
    const week = weeks_[0];
    startDate.value = moment(week[0]).format('MMM Do , YYYY');
    endDate.value = moment(week[1]).format('MMM Do , YYYY');
  }
  weeks.value = weeks_;
};
</script>
