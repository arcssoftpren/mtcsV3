<template>
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
        <td class="text-center" colspan="3">
          {{ moment(month).format('MMMM YYYY') }}
        </td>
      </tr>
    </thead>
  </table>
  <table class="inspectionHeader mt-4 text-sm-body-2">
    <tr>
      <th rowspan="2">Inspection Items</th>
      <th rowspan="2">Check Methods</th>
      <th class="text-center" :colspan="dates.length">Dates</th>
    </tr>
    <tr>
      <th class="text-center" v-for="(date, index) in dates" :key="index">
        {{ date }}
      </th>
    </tr>
    <template
      v-for="(item, index) in inspectionsData.inspectionItems"
      :key="index"
    >
      <tr v-for="(method, mindex) in item.methods" :key="mindex">
        <td v-if="mindex === 0" :rowspan="item.methods.length">
          {{ item.label }}
        </td>
        <td>{{ method.label }}</td>
        <td
          class="text-no-wrap text-center"
          v-for="(date, dateIndex) in dates"
          :key="dateIndex"
        >
          <div v-if="getData(date, method)" class="d-flex justify-center">
            <v-icon
              :color="
                getData(date, method)?.judgement == 1 ? 'success' : 'error'
              "
              v-if="method.logic == 1 || method.logic == 16"
              >{{ getData(date, method)?.value }}
            </v-icon>
            <v-chip
              :color="
                getData(date, method)?.judgement == 1 ? 'success' : 'error'
              "
              v-else
            >
              {{ getData(date, method)?.value }} {{ method.unit }}
            </v-chip>
          </div>
        </td>
      </tr>

      <tr v-if="index === inspectionsData.inspectionItems.length - 1">
        <td colspan="2">Operator</td>
        <td v-for="(date, d) in dates" :key="d">
          <div class="text-center">
            {{ findOperator(date) }}
          </div>
        </td>
      </tr>
    </template>
    <tr>
      <td colspan="2">Leader</td>
      <td
        class="text-center"
        v-for="(weekData, index) in weekDatas"
        :key="index"
        :colspan="weekData.diff"
      >
        {{ weekData.inspections }}
      </td>
    </tr>
  </table>
  <v-row>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12">
      <v-btn variant="outlined" rounded="pill" block @click="confirm">
        Confirm
      </v-btn>
    </v-col>
  </v-row>
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import moment from 'moment';

const store = useAppStore();
const props = defineProps(['inspectionsData', 'month']);
const emits = defineEmits(['confirmed']);
const dates = ref([]);
const weekDatas = ref([]);
for (let i = 1; i <= moment(props.month).daysInMonth(); i++) {
  dates.value.push(i);
}

const findOperator = (date) => {
  const insData = props.inspectionsData.inspections;
  const filter = insData.filter((ins) => {
    return ins != null;
  });
  const myData = filter.find((data) => {
    const startDate = moment(data.dateRangeStart);
    const endDate = moment(data.dateRangeEnd);
    const checkDate = moment(props.month).date(date);
    return checkDate.isBetween(startDate, endDate, null, '[]');
  });
  const dailyData = myData?.inspections.find(
    (d) =>
      moment(d.inspectionDate).format('D') == date &&
      moment(d.inspectionDate).format('YYYY-MM') == props.month
  );

  return dailyData ? dailyData.inspectorName : '-';
};

const generateWeeklyData = () => {
  const insData = props.inspectionsData.inspections.filter((ins) => {
    return ins != null;
  });
  const year = moment(props.month, 'YYYY-MM').year();
  const monthNum = moment(props.month, 'YYYY-MM').month(); // 0-based
  const startOfMonth = moment([year, monthNum, 1]);
  const endOfMonth = moment([year, monthNum]).endOf('month');
  const weeks_ = [];
  let current = startOfMonth.clone().startOf('isoWeek'); // Monday of the week containing the 1st
  while (current.isBefore(endOfMonth) || current.isSame(endOfMonth, 'day')) {
    let weekStart = current.format('YYYY-MM-DD');
    let weekEnd = current.clone().endOf('isoWeek').format('YYYY-MM-DD');

    if (moment(weekStart).isBefore(startOfMonth)) {
      weekStart = startOfMonth.format('YYYY-MM-DD');
    }

    if (moment(weekEnd).isAfter(endOfMonth)) {
      weekEnd = endOfMonth.format('YYYY-MM-DD');
    }

    const weekData = {
      weekStart,
      weekEnd,
      diff: moment(weekEnd).diff(moment(weekStart), 'days') + 1,
      inspections:
        insData.find((ins) => {
          const insStart = moment(ins.dateRangeStart);
          const insEnd = moment(ins.dateRangeEnd);
          return (
            insStart.isBetween(weekStart, weekEnd, null, '[]') ||
            insEnd.isBetween(weekStart, weekEnd, null, '[]') ||
            (insStart.isBefore(weekStart) && insEnd.isAfter(weekEnd))
          );
        })?.confirmatorName || '-',
    }; // Sunday
    weeks_.push(weekData);
    current.add(1, 'week');
  }
  weekDatas.value = weeks_;
};

const getData = (date, method) => {
  const insData = props.inspectionsData.inspections;
  let arr = [];
  insData.forEach((ins) => {
    ins?.inspections.forEach((data) => {
      arr.push(data);
    });
  });
  const data = arr.find(
    (d) =>
      moment(d.inspectionDate).format('D') == date &&
      moment(d.inspectionDate).format('YYYY-MM') == props.month
  );

  const finalData = data?.methods.find((m) => m.methodId == method.methodId);

  const result = {
    judgement: finalData ? finalData?.judgement : null,
    value:
      method.logic == 1 || method.logic == 16
        ? finalData?.judgement == 1
          ? 'mdi-circle-outline'
          : finalData?.judgement == 0
            ? 'mdi-close'
            : 'mdi-minus'
        : finalData?.value,
  };

  return finalData ? result : null;
};

onMounted(() => {
  generateWeeklyData();
});

const confirm = async () => {
  const confirmationData = {
    month: props.month,
    confirmator: store.userData.userId,
    confirmationDate: moment().format('YYYY-MM-DD'),
    toolId: props.inspectionsData.toolId,
  };
  try {
    await store.fetchData(
      confirmationData,
      '/inspections/monthly/confirm',
      'post'
    );
    emits('confirmed');
    store.myAlert.fire({
      icon: 'success',
      title: 'Monthly Inspection Confirmed',
      text: 'You have successfully confirmed the monthly inspection.',
    });
  } catch (error) {
    store.myAlert.fire(error);
    console.log(error);
  }
};
</script>
