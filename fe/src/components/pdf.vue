<template>
  {{ inspectionsData }}
  <div :class="props.paperSize" :style="`--scale: ${props.scale}`">
    <p class="docnumber text-start">({{ props.documentNumber }})</p>
    <table class="mt-2">
      <thead>
        <tr>
          <th class="text-start logoContainer">
            <v-img
              src="@/assets/images/softpren.png"
              :width="40 * props.scale"
            />
          </th>
          <th>
            <div class="text-primary text-center companyName">
              <div>PT. SOFTPREN INDUSTRIES</div>
              <div>INDONESIA</div>
            </div>
          </th>
          <th class="title">
            Lembar Pemeriksaan Harian Alat Ukur
            {{ props.inspectionsData.rankName }}
          </th>
          <th>
            <table class="bordered tableBody">
              <tbody>
                <tr>
                  <td class="bordered">Approved By</td>
                </tr>
                <tr>
                  <td class="bordered" :height="55 * props.scale"></td>
                </tr>
                <tr>
                  <td class="bordered"></td>
                </tr>
              </tbody>
            </table>
          </th>
        </tr>
      </thead>
    </table>
    <table class="mt-2 tableBody w-50 text-start">
      <tbody>
        <tr>
          <td>MODEL/TYPE</td>
          <td>: {{ props.inspectionsData.typeName }}</td>
          <td>AREA</td>
          <td>: {{ props.inspectionsData.location }}</td>
        </tr>
        <tr>
          <td>NO. CONTROL / NO. SERI</td>
          <td>: {{ props.inspectionsData.regNumber }}</td>
          <td>PERIODE BULAN/ TAHUN</td>
          <td>: {{ moment(props.month).format('MMMM YYYY') }}</td>
        </tr>
      </tbody>
    </table>
    <table class="main-table mt-2">
      <tbody>
        <tr>
          <td class="small" rowspan="2">NO</td>
          <td class="big" rowspan="2">POINT CHECK</td>
          <td class="big" rowspan="2">CHECK METHOD</td>
          <td class="big" :colspan="dates.length">TANGGAL</td>
        </tr>
        <tr style="border-bottom: double">
          <td
            :style="{ width: 35 * props.scale + 'px' }"
            class="text-center small"
            v-for="(date, index) in dates"
            :key="index"
          >
            {{ date }}
          </td>
        </tr>
        <template
          v-for="(item, index) in inspectionsData.inspectionItems"
          :key="index"
        >
          <tr
            v-for="(method, mindex) in item.methods"
            :key="mindex"
            class="text-start"
          >
            <td
              class="small"
              v-if="mindex === 0"
              :rowspan="item.methods.length"
            >
              {{ index + 1 }}
            </td>
            <td
              class="small"
              v-if="mindex === 0"
              :rowspan="item.methods.length"
            >
              {{ item.label }}
            </td>
            <td class="small">{{ method.label }}</td>
            <td
              class="text-no-wrap text-center small"
              v-for="(date, dateIndex) in dates"
              :key="dateIndex"
            >
              <div v-if="getData(date, method)" class="d-flex justify-center">
                <v-icon v-if="method.logic == 1 || method.logic == 16">
                  {{ getData(date, method)?.value }}
                </v-icon>
                <p v-else>
                  {{ getData(date, method)?.value }} {{ method.unit }}
                </p>
              </div>
            </td>
          </tr>

          <tr
            class="small"
            v-if="index === inspectionsData.inspectionItems.length - 1"
          >
            <td colspan="3" class="small">Operator</td>
            <td v-for="(date, d) in dates" :key="d" class="small">
              <div class="text-center">
                {{ findOperator(date) }}
              </div>
            </td>
          </tr>
        </template>
        <tr>
          <td colspan="3" class="text-center small">Leader</td>
          <td
            class="text-center small"
            v-for="(weekData, index) in weekDatas"
            :key="index"
            :colspan="weekData.diff"
          >
            {{ weekData.inspections }}
          </td>
        </tr>
      </tbody>
    </table>
    <table class="mt-2 text-start">
      <tbody>
        <tr>
          <td :style="{ width: 3 * props.scale + 'in' }">
            <v-img :src="imageUrl"></v-img>
          </td>
          <td :style="{ padding: 5 * props.scale + 'px' }">
            <table class="legend-table">
              <tbody>
                <tr>
                  <td colspan="3" class="label-cell rules-cell">
                    ATURAN PENGECEKAN
                  </td>
                  <td rowspan="7" class="rules-cell">
                    <table class="rules-table">
                      <tbody>
                        <tr>
                          <td class="rule-number">1.</td>
                          <td class="rule-text">
                            Operator melakukan pengecekan setiap hari sebelum
                            memulai pekerjaan.
                          </td>
                        </tr>
                        <tr>
                          <td class="rule-number">2.</td>
                          <td class="rule-text">
                            Operator harus memberi tanda garis (−) pada hari
                            tersebut jika alat ukur tidak digunakan (mesin tidak
                            berproduksi atau hari libur).
                          </td>
                        </tr>
                        <tr>
                          <td class="rule-number">3.</td>
                          <td class="rule-text">
                            Operator wajib melaporkan kepada atasan jika
                            menemukan hasil pengecekan yang NG.
                          </td>
                        </tr>
                        <tr>
                          <td class="rule-number">4.</td>
                          <td class="rule-text">
                            Jika alat ukur jatuh, operator harus
                            mengembalikannya kepada atasan quality untuk dicek
                            kelayakannya.
                          </td>
                        </tr>
                        <tr>
                          <td class="rule-number">5.</td>
                          <td class="rule-text">
                            Atasan departement penanggung jawab (GL/SPV/Mgr)
                            melakukan pengecekan sekali setiap minggu.
                          </td>
                        </tr>
                        <tr>
                          <td class="rule-number">6.</td>
                          <td class="rule-text">
                            Atasan departemen penanggung jawab (GL/SPV/Mgr)
                            menandatangani kolom checked dan menyerahkannya
                            check sheet ke QC Dep setiap akhir bulan.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colspan="3" class="label-cell">Cara Pengisian</td>
                </tr>
                <tr>
                  <td class="symbol-cell">O</td>
                  <td class="symbol-separator">:</td>
                  <td class="legend-text">OK</td>
                </tr>
                <tr>
                  <td class="symbol-cell">X</td>
                  <td class="symbol-separator">:</td>
                  <td class="legend-text">NG</td>
                </tr>
                <tr>
                  <td class="symbol-cell repair-symbol">⊗</td>
                  <td class="symbol-separator">:</td>
                  <td class="legend-text">Sudah repair</td>
                </tr>
                <tr>
                  <td class="symbol-cell">―</td>
                  <td class="symbol-separator">:</td>
                  <td class="legend-text">Not Use</td>
                </tr>
              </tbody>
            </table>

            <table class="main-table med">
              <tbody>
                <tr>
                  <td
                    class="text-center"
                    rowspan="3"
                    :style="{ width: 16 * props.scale + 'px' }"
                  >
                    No
                  </td>
                  <td class="text-center" colspan="4">
                    Catatan Perbaikan / Masalah
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Pengguna</td>
                  <td colspan="2" class="text-center">QC</td>
                </tr>
                <tr class="text-center">
                  <td>Tanggal</td>
                  <td>Masalah yang terjadi</td>
                  <td>Tindakan Perbaikan</td>
                  <td>Approved by</td>
                </tr>
                <tr class="text-center">
                  <td>1</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr class="text-center">
                  <td>2</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr class="text-center">
                  <td>3</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr class="text-center">
                  <td>4</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  {{ signArr }}
</template>
<script setup>
import { useAppStore } from '@/stores/app';
import moment from 'moment';

const props = defineProps([
  'scale',
  'documentNumber',
  'paperSize',
  'month',
  'inspectionsData',
]);

const signArr = ref([]);

const store = useAppStore();

const imageUrl = ref('');

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

const generateWeeklyData = async () => {
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
      inspections: insData.find((ins) => {
        const insStart = moment(ins.dateRangeStart);
        const insEnd = moment(ins.dateRangeEnd);
        return (
          insStart.isBetween(weekStart, weekEnd, null, '[]') ||
          insEnd.isBetween(weekStart, weekEnd, null, '[]') ||
          (insStart.isBefore(weekStart) && insEnd.isAfter(weekEnd))
        );
      })?.confirmatorName,
      confId: insData.find((ins) => {
        const insStart = moment(ins.dateRangeStart);
        const insEnd = moment(ins.dateRangeEnd);
        return (
          insStart.isBetween(weekStart, weekEnd, null, '[]') ||
          insEnd.isBetween(weekStart, weekEnd, null, '[]') ||
          (insStart.isBefore(weekStart) && insEnd.isAfter(weekEnd))
        );
      })?.confirmator,
    }; // Sunday
    weeks_.push(weekData);
    current.add(1, 'week');
  }
  weekDatas.value = weeks_;
  signArr.value = weekDatas.value.map((w) => {
    return w.confId;
  });
  signArr.value = signArr.value.filter((v) => v);
  try {
    const response = await getImage(props.inspectionsData.toolId);
  } catch (error) {
    console.log(error);
  }
};

const getImage = async (id) => {
  try {
    const response = await store.fetchData(null, `/tools/image/${id}`, 'GET');
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
</script>
<style scoped>
/* a4 paper */

* {
  font-family: MS Pgothic;
}

table {
  border-collapse: collapse;
  width: 100%;
}

table.main-table {
  border: solid 1px black;
}

table.main-table th,
table.main-table td {
  border: solid 1px black;
  padding: calc(4px * var(--scale));
}

.main-table th.small,
.main-table td.small {
  font-size: calc(10px * var(--scale));
}

.main-table th.med,
.main-table td.med {
  font-size: calc(11px * var(--scale));
}

.main-table th.big,
.main-table td.big {
  font-size: calc(12px * var(--scale));
}

.main-table.small th,
.main-table.small td {
  font-size: calc(10px * var(--scale));
}

.main-table.med th,
.main-table.med td {
  font-size: calc(11px * var(--scale));
}

.bordered {
  border: solid 1px black;
}

.A4 {
  width: calc(297mm * var(--scale));
  min-height: calc(210mm * var(--scale));
  padding: calc(5mm * var(--scale));
  margin: 20px auto;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background: white;
  color: black;
}

.A3 {
  width: calc(420mm * var(--scale));
  min-height: calc(297mm * var(--scale));
  padding: calc(5mm * var(--scale));
  margin: 20px auto;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  background: white;
  color: black;
}

.header {
  font-size: calc(12px * var(--scale));
}

.docnumber {
  font-size: calc(10px * var(--scale));
}

.companyName {
  font-size: calc(12px * var(--scale));
  text-decoration: underline;
}

.A3 .title {
  font-size: calc(26px * var(--scale));
}

.A4 .title {
  font-size: calc(20px * var(--scale));
}

.tableBody td {
  font-size: calc(11px * var(--scale));
  padding: calc(2px * var(--scale));
}

.legend-table,
.rules-table {
  width: 100%;
  margin-bottom: calc(8px * var(--scale));
  border-collapse: collapse;
}

.legend-table td {
  padding: calc(2px * var(--scale));
  font-size: calc(11px * var(--scale));
  vertical-align: top;
}

.label-cell {
  font-weight: bold;
  padding-right: calc(15px * var(--scale));
  white-space: nowrap;
  vertical-align: top;
}

.rules-cell {
  padding-left: calc(30px * var(--scale));
}

.symbol-cell {
  text-align: center;
  width: calc(20px * var(--scale));
  font-weight: bold;
}

.repair-symbol {
  font-size: calc(14px * var(--scale));
}

.symbol-separator {
  text-align: center;
  width: calc(10px * var(--scale));
  padding: 0 calc(5px * var(--scale));
}

.legend-text {
  text-align: left;
  padding-right: calc(20px * var(--scale));
}

.rules-table td {
  padding: calc(1px * var(--scale)) 0;
  font-size: calc(11px * var(--scale));
  vertical-align: top;
}

.rule-number {
  width: calc(20px * var(--scale));
  text-align: left;
  padding-right: calc(5px * var(--scale));
}

.rule-text {
  text-align: left;
  line-height: 1.3;
}
</style>
