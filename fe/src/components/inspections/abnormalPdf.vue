<template>
  <div class="paper-wrap">
    <div ref="printArea" class="A4" :style="`--scale: ${props.scale}`">
      <div class="text-start doc-number mb-2">
        {{ props.documentNumber }}
      </div>
      <table class="main-table">
        <thead>
          <tr>
            <th colspan="6" class="main-title text-start" rowspan="4">
              Laporan Abnormality Alat Ukur
            </th>
            <th colspan="2" class="dept-header">Dep. Penemu</th>
          </tr>
          <tr>
            <td class="signature-role">GL/SV/Mgr</td>
            <td class="signature-role">PIC</td>
          </tr>
          <tr>
            <td class="signature-box">
              <div
                v-if="
                  phaseData.confirmator && getSignature(phaseData.confirmator)
                "
              >
                <img
                  :src="getSignature(phaseData.confirmator)"
                  class="signature-image"
                />
              </div>
            </td>
            <td class="signature-box">
              <div
                v-if="phaseData.reporter && getSignature(phaseData.reporter)"
              >
                <img
                  :src="getSignature(phaseData.reporter)"
                  class="signature-image"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td class="signature-name">{{ phaseData.confirmatorName }}</td>
            <td class="signature-name">{{ phaseData.reporterName }}</td>
          </tr>
          <tr>
            <td colspan="8" class="spacer-row"></td>
          </tr>
          <tr>
            <td rowspan="3" class="section-vertical">
              Deteksi Abnormal Process
            </td>
            <td class="text-start checkbox-cell" colspan="2" rowspan="2"> 
              <input type="checkbox" id="calCb" class="checkbox-scaled" :checked="props.abnormalityData.type === 2"></input>
              <label for="calCb" class="checkbox-label">Kalibrasi</label>
            </td>
            <td colspan="5" class="section-header text-start">Detail Temuan Abnormality</td>
          </tr>
          <tr>
            <td colspan="5" rowspan="2" class="text-start align-content-start" >
              {{ props.abnormalityData.findingDescription || '' }}
            </td>
          </tr>
          <tr> 
            <td class="text-start checkbox-cell" colspan="2">
              <input type="checkbox" id="dailyCb" class="checkbox-scaled" :checked="props.abnormalityData.type === 1"></input>
              <label for="dailyCb" class="checkbox-label">Pengecekan Harian</label>
            </td>
          </tr>
          <tr>
            <td colspan="8" class="spacer-row"></td>
          </tr>
          <tr>
            <td rowspan="3" class="section-vertical">
              Kejadian Abnormality
            </td>
            <td class="field-label text-start no-border" >
              Tanggal Ditemukan
            </td>
            <td class="no-border" >:</td>
            <td class="field-value border-left-only" >{{ props.abnormalityData.findingDate || '' }}</td>
            <td class="field-label text-start no-border" >Tempat digunakan</td>
            <td class="no-border" >:</td>
            <td colspan="2" class="field-value no-border">{{ props.abnormalityData.location || '' }}</td>
          </tr>
          <tr>
            <td class="field-label text-start no-border" >
              Nama alat ukur
            </td>
            <td class="no-border" >:</td>
            <td class="field-value border-left-only">{{ props.abnormalityData.toolName || '' }}</td>
            <td class="field-label text-start no-border" >Dep Pengguna</td>
            <td class="no-border" >:</td>
            <td colspan="2" class="field-value no-border">{{ props.abnormalityData.userDepartment || '' }}</td>
          </tr>
          <tr>
            <td class="field-label text-start no-border" >
              No. kontrol
            </td>
            <td class="no-border" >:</td>
            <td class="field-value border-left-only">{{ props.abnormalityData.regNumber || '' }}</td>
            <td class="field-label text-start no-border" >Tanggal kalibrasi terakhir</td>
            <td class="no-border" >:</td>
            <td colspan="2" class="field-value no-border">{{ props.abnormalityData.lastCalibrationDate || '' }}</td>
          </tr>
          <tr>
            <td colspan="8" class="spacer-row"></td>
          </tr>
          <tr>
            <td class="section-vertical">
              Penyebab
            </td>
            <td colspan="7" class="content-area-large text-start">{{ phaseData.cause }}</td>
          </tr>
          <tr>
            <td colspan="8" class="spacer-row"></td>
          </tr>
          <tr>
            <td class="section-vertical">
              Perbaikan
            </td>
            <td colspan="7" class="content-area-large text-start">{{ phaseData.tempActions }}</td>
          </tr>
          
          <tr>
            <td colspan="8" class="spacer-row"></td>
          </tr>
          <tr>
            <td rowspan="6" class="section-vertical">Perlakuan</td>
            <td colspan="7" class="text-start section-header">Perlakuan Produk : </td>
          </tr>
          <tr>
            <td colspan="7" class="text-start ">{{ phase2Data.actToProducts || '(Contoh : Random sampling check terhadap produk yang sudah terbuat)' }}</td>
          </tr>
          <tr>
            <td colspan="2" class="field-label text-start no-border">Perlakuan Alat Ukur :</td>
            <td class="text-no-wrap">
              <input type="checkbox" id="repair" class="checkbox-scaled" :checked="phase2Data.actToTools?.includes('repaired')"></input>
              <label for="repair" class="checkbox-label">Repair</label>
            </td>
            <td class="text-no-wrap" colspan="2" >
              <input type="checkbox" id="dispose" class="checkbox-scaled" :checked="phase2Data.actToTools?.includes('disposal')"></input>
              <label for="dispose" class="checkbox-label">Disposal</label>
            </td>
            <td colspan="2" class="dept-header">Dep. QC</td>
          </tr>
          <tr >
            <td colspan="5" rowspan="3" class="note-text content-area-medium text-start">
              Note: {{ phase2Data.qcActionNote }}
            </td>
            <td class="signature-role">GL/SV/Mgr</td>
            <td class="signature-role">PIC</td>
          </tr>
          <tr>
            <td class="signature-box">
              <div v-if="phase2Data.qcMgr && getSignature(phase2Data.qcMgr)">
                <img
                  :src="getSignature(phase2Data.qcMgr)"
                  class="signature-image"
                />
              </div>
            </td>
            <td class="signature-box">
              <div v-if="phase2Data.qcPIC && getSignature(phase2Data.qcPIC)">
                <img
                  :src="getSignature(phase2Data.qcPIC)"
                  class="signature-image"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td class="signature-name">{{ phase2Data.qcMgrName }}</td>
            <td class="signature-name">{{ phase2Data.qcPICName }}</td>
          </tr>
          <tr>
            <td colspan="8" class="spacer-row"></td>
          </tr>
          <tr>
            <td colspan="7" class="section-header text-start">Konfirmasi Tindakan di Atas:</td>
            <td class="dept-header">Dep. Pengguna</td>
          </tr>
          <tr>
            <td rowspan="2" colspan="7" class="content-area-medium text-start">{{ phase3Data.prodConfirmNote }}</td>
            <td class="signature-box">
              <div v-if="phase3Data.prodConfirmator && getSignature(phase3Data.prodConfirmator)">
                <img
                  :src="getSignature(phase3Data.prodConfirmator)"
                  class="signature-image"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td class="signature-name">{{ phase3Data.prodConfirmatorName }}</td>
          </tr>
          
          <tr>
            <td colspan="8" class="spacer-row"></td>
          </tr>
          <tr>
            <td colspan="6" class="section-header text-start">
              Menyetujui dan mengkonfirmasi tindakan di atas:
            </td>
            <td colspan="2" class="dept-header">Dep. QC</td>
          </tr>
          <tr>
            <td colspan="6" rowspan="3" class="content-area-medium text-start">{{ phase4Data.qcConfirmNote }}</td>
            <td class="signature-role">GL/SV/Mgr</td>
            <td class="signature-role">Konfirmasi</td>
          </tr>
          <tr>
            <td class="signature-box">
              <div v-if="phase4Data.qcMgr4 && getSignature(phase4Data.qcMgr4)">
                <img
                  :src="getSignature(phase4Data.qcMgr4)"
                  class="signature-image"
                />
              </div>
            </td>
            <td class="signature-box">
              <div v-if="phase4Data.qcConfirmator && getSignature(phase4Data.qcConfirmator)">
                <img
                  :src="getSignature(phase4Data.qcConfirmator)"
                  class="signature-image"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td class="signature-name">{{ phase4Data.qcMgr4Name }}</td>
            <td class="signature-name">{{ phase4Data.qcConfirmatorName }}</td>
          </tr>
        </thead>
      </table>
    </div>
  </div>
  <div class="position-fixed" style="top: 105px; right: 30px; z-index: 1000">
    <v-btn size="small" flat icon color="primary" @click="print">
      <v-icon>mdi-download</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAppStore } from '@/stores/app';
import html2pdf from 'html2pdf.js';
import moment from 'moment';

const props = defineProps({
  scale: {
    type: Number,
    default: 1,
  },
  documentNumber: {
    type: String,
    default: 'Form-7151-001',
  },
  abnormalityData: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['maximalize']);

const store = useAppStore();
const signArr = ref([]);

const phaseData = ref({
  cause: '',
  tempActions: '',
  reporter: null,
  reporterName: '',
  confirmator: null,
  confirmatorName: '',
});

const phase2Data = ref({
  actToProducts: '',
  actToTools: [],
  qcActionNote: '',
  qcPIC: null,
  qcPICName: '',
  qcMgr: null,
  qcMgrName: '',
});

const phase3Data = ref({
  prodConfirmNote: '',
  prodConfirmator: null,
  prodConfirmatorName: '',
});

const phase4Data = ref({
  qcConfirmNote: '',
  qcMgr4: null,
  qcMgr4Name: '',
  qcConfirmator: null,
  qcConfirmatorName: '',
});

const getSignature = (userId) => {
  const sign = signArr.value.find((s) => s.id === userId);
  return sign?.image || null;
};

const getSignData = async (id) => {
  if (!id || signArr.value.some((sign) => sign.id === id)) return;

  try {
    const { data } = await store.fetchData(
      null,
      `/users/${id}/signature`,
      'GET'
    );
    signArr.value.push({
      id: id,
      image: data ? `data:image/png;base64,${data}` : null,
    });
  } catch (error) {
    console.error('Error loading signature:', error);
  }
};

const loadPhaseData = async () => {
  if (!props.abnormalityData?.id) return;

  try {
    const response = await store.fetchData(
      {},
      `/inspections/abnormalities/getPhase/${props.abnormalityData.id}`
    );

    if (response.data) {
      console.log('Response data:', response.data);
      console.log('abnormalityData:', props.abnormalityData);
      phaseData.value = {
        cause: response.data.cause || '',
        tempActions: response.data.tempActions || '',
        reporter: response.data.reporter,
        reporterName: response.data.reporterName || '',
        confirmator:
          response.data.confirmator || props.abnormalityData.confirmator,
        confirmatorName:
          response.data.confirmatorName ||
          props.abnormalityData.confirmatorName ||
          '',
      };

      phase2Data.value = {
        actToProducts: response.data.actToProducts || '',
        actToTools: response.data.actToTools?.split(',') || [],
        qcActionNote: response.data.qcActionNote || '',
        qcPIC: response.data.qcPIC,
        qcPICName: response.data.qcPICName || '',
        qcMgr: response.data.qcMgr,
        qcMgrName: response.data.qcMgrName || '',
      };

      phase3Data.value = {
        prodConfirmNote: response.data.prodConfirmNote || '',
        prodConfirmator: response.data.prodConfirmator,
        prodConfirmatorName: response.data.prodConfirmatorName || '',
      };

      phase4Data.value = {
        qcConfirmNote: response.data.qcConfirmNote || '',
        qcMgr4: response.data.qcMgr4,
        qcMgr4Name: response.data.qcMgr4Name || '',
        qcConfirmator: response.data.qcConfirmator,
        qcConfirmatorName: response.data.qcConfirmatorName || '',
      };

      await Promise.all([
        getSignData(props.abnormalityData.confirmator),
        getSignData(response.data.reporter),
        getSignData(response.data.confirmator),
        getSignData(response.data.qcPIC),
        getSignData(response.data.qcMgr),
        getSignData(response.data.prodConfirmator),
        getSignData(response.data.qcMgr4),
        getSignData(response.data.qcConfirmator),
      ]);
    } else {
      // Fallback ke abnormalityData jika tidak ada response.data
      phaseData.value.confirmator = props.abnormalityData.confirmator;
      phaseData.value.confirmatorName =
        props.abnormalityData.confirmatorName || '';

      await getSignData(props.abnormalityData.confirmator);
    }
  } catch (error) {
    console.error('Error loading phase data:', error);
    // Fallback ke abnormalityData jika error
    phaseData.value.confirmator = props.abnormalityData.confirmator;
    phaseData.value.confirmatorName =
      props.abnormalityData.confirmatorName || '';

    await getSignData(props.abnormalityData.confirmator);
  }
};

const printArea = ref(null);

const print = async () => {
  await emits('maximalize');

  const el = printArea.value;
  
  // Force scale to 1 for PDF generation
  const originalScale = el.style.getPropertyValue('--scale');
  el.style.setProperty('--scale', '1');
  
  // Wait for re-render with new scale
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const fileName = `abnormality_report_${props.abnormalityData?.regNumber?.replace(/\s+/g, '_') || 'report'}_${moment().format('YYYY_MM_DD')}`;
  const opt = {
    margin: [2, 2, 2, 2],
    filename: fileName,
    pagebreak: { mode: ['avoid'] },
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 5, useCORS: true, windowHeight: el.scrollHeight },
    jsPDF: { unit: 'mm', format: [210, 330], orientation: 'portrait' },
  };
  html2pdf()
    .set(opt)
    .from(el)
    .toPdf()
    .get('pdf')
    .then(function (pdf) {
      if (pdf.internal.getNumberOfPages() > 1) {
        pdf.deletePage(pdf.internal.getNumberOfPages());
      }
      // Restore original scale after PDF generation
      el.style.setProperty('--scale', originalScale || props.scale.toString());
    })
    .save();
};

watch(() => props.abnormalityData?.id, loadPhaseData, { immediate: true });
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
  border: solid calc(1px * var(--scale)) black;
}

table.main-table th,
table.main-table td {
  border: solid calc(1px * var(--scale)) black;
  padding: calc(4px * var(--scale));
  font-size: calc(10pt * var(--scale));
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
  border: solid calc(1px * var(--scale)) black;
}

.A4 {
  width: calc(210mm * var(--scale));
  min-height: calc(297mm * var(--scale));
  padding: calc(5mm * var(--scale));
  margin: calc(20px * var(--scale)) auto;
  box-shadow: 0 0 calc(5px * var(--scale)) rgba(0, 0, 0, 0.1);
  background: white;
  color: black;
  font-size: calc(10pt * var(--scale));
}

.header {
  font-size: calc(12px * var(--scale));
}

.docnumber {
  font-size: calc(10px * var(--scale));
}

.A4 .title {
  font-size: calc(20px * var(--scale));
}

/* Font Size Classes */
.doc-number {
  font-size: calc(9pt * var(--scale));
}

.main-title {
  font-size: calc(21pt * var(--scale))!important;
  font-weight: normal;
}

.dept-header {
  font-size: calc(11pt * var(--scale));
  text-align: center;
  font-weight: bold;
}

.signature-role {
  font-size: calc(9pt * var(--scale));
  text-align: center;
}

.signature-name {
  font-size: calc(8pt * var(--scale));
  text-align: center;
  height: calc(8mm * var(--scale));
}

.section-vertical {
  font-size: calc(10pt * var(--scale));
  text-align: center;
  padding: calc(4px * var(--scale));
  font-weight: bold;
  background-color: transparent;
}

.field-label {
  font-size: calc(10pt * var(--scale));
  white-space: nowrap;
}

.field-value {
  font-size: calc(10pt * var(--scale));
}

.checkbox-label {
  font-size: calc(10pt * var(--scale));
}

.red-italic-note {
  font-size: calc(9pt * var(--scale));
  color: red;
  font-style: italic;
}

.note-text {
  font-size: calc(9pt * var(--scale));
}

.content-text {
  font-size: calc(10pt * var(--scale));
}

.section-header {
  font-size: calc(10pt * var(--scale));
}

/* Layout Classes */
.no-border {
  border-left: none !important;
  border-right: none !important;
}

.border-left-only {
  border-left: none !important;
}

.signature-box {
  height: calc(20mm * var(--scale));
  text-align: center;
  vertical-align: middle;
  padding: calc(2mm * var(--scale));
}

.signature-image {
  max-height: calc(13mm * var(--scale));
  max-width: calc(30mm * var(--scale));
  object-fit: contain;
}

.content-area-small {
  min-height: calc(10mm * var(--scale));
  vertical-align: top;
}

.content-area-medium {
  min-height: calc(15mm * var(--scale));
  vertical-align: top;
}

.content-area-large {
  min-height: calc(20mm * var(--scale));
  vertical-align: top;
}

.spacer-row {
  height: calc(3mm * var(--scale));
  border: none !important;
  background: none !important;
  padding: 0 !important;
}

.center-text {
  text-align: center;
}

.left-text {
  text-align: left;
}

.checkbox-scaled {
  transform: scale(calc(var(--scale) * 1.1));
  margin-right: calc(3px * var(--scale));
}

.checkbox-cell {
  vertical-align: middle;
  height: calc(20mm * var(--scale));
  max-height: calc(20mm * var(--scale));
}

.border-bottom-only {
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
}

.vertical-align-top {
  vertical-align: top;
}

.text-no-wrap {
  white-space: nowrap;
  font-size: calc(10pt * var(--scale));
}

.paper-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(20px * var(--scale, 1));
  box-sizing: border-box;
}
</style>
