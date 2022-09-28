<script setup lang="ts">
import { ref, computed } from "vue";
import { PDFDocument, PDFImage, PDFPage } from "pdf-lib";
import { formatDate } from "src/common/format";

interface Files {
  [key: string]: string[];
}
interface MergeAttachmentsProps {
  files: Files;
}

const props = defineProps<MergeAttachmentsProps>();
const pageMargin = 20;
const loading = ref(false);
const group = ref<string[]>([]);
const options = computed(() => {
  const opt = [];
  for (const [field, files] of Object.entries(props.files)) {
    opt.push({
      label: field,
      value: files[0],
    });
  }
  return opt;
});
const sequence = computed(() => {
  const result: string[] = [];
  for (const groupItem of group.value) {
    const item = options.value.find((item) => item.value === groupItem);
    if (item) {
      result.push(item.label);
    }
  }
  return result;
});

async function fetchFile(url: string): Promise<ArrayBuffer> {
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  return buffer;
}

async function appendPDF(pdfDoc: PDFDocument, pdfBytes: ArrayBuffer) {
  const pdf = await PDFDocument.load(pdfBytes);
  const pdfPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
  pdfPages.forEach((page) => pdfDoc.addPage(page));
}

async function appendImage(
  pdfDoc: PDFDocument,
  imgType: "png" | "jpg",
  imgBytes: ArrayBuffer,
  lastImgEnds?: number
) {
  let lastPage: PDFPage | undefined = undefined;
  const pages = pdfDoc.getPages();
  if (lastImgEnds && pages.length) {
    lastPage = pages[pages.length - 1];
  }

  let page = lastPage || pdfDoc.addPage();
  const pageDims = {
    width: page.getWidth(),
    height: page.getHeight(),
  };

  let image: PDFImage;
  if (imgType === "jpg") {
    image = await pdfDoc.embedJpg(imgBytes);
  } else {
    image = await pdfDoc.embedPng(imgBytes);
  }

  const maxWidth = pageDims.width - pageMargin * 2;
  const maxHeight = pageDims.height - pageMargin * 2;
  const imageDims = image.scaleToFit(
    image.width > maxWidth ? maxWidth : image.width,
    image.height > maxHeight ? maxHeight : image.height
  );

  let drawY = pageDims.height - imageDims.height - pageMargin;
  if (lastImgEnds) {
    const remainingSpace = lastImgEnds - pageMargin;
    const imgFits = remainingSpace - imageDims.height - pageMargin >= 0;
    if (imgFits) {
      drawY = remainingSpace - imageDims.height;
    } else {
      page = pdfDoc.addPage();
    }
  }

  const drawX = pageDims.width / 2 - imageDims.width / 2;
  page.drawImage(image, {
    x: drawX,
    y: drawY,
    width: imageDims.width,
    height: imageDims.height,
  });
  return drawY;
}

function downloadPdf(bytes: Uint8Array) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = window.URL.createObjectURL(blob);
  const date = formatDate(new Date(), false, true);
  a.download = `anexos-${date}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function handleMerge() {
  const files = group.value;
  if (!files.length) return;
  loading.value = true;

  const pdfDoc = await PDFDocument.create();

  let lastImgEnds: number | undefined;
  for (const url of files) {
    if (url.match(/.pdf$/i)) {
      lastImgEnds = undefined;
      await appendPDF(pdfDoc, await fetchFile(url));
    } else if (url.match(/.(jpg|jpeg)$/i)) {
      lastImgEnds = await appendImage(
        pdfDoc,
        "jpg",
        await fetchFile(url),
        lastImgEnds
      );
    } else if (url.match(/.(png)$/i)) {
      lastImgEnds = await appendImage(
        pdfDoc,
        "png",
        await fetchFile(url),
        lastImgEnds
      );
    }
  }

  const pdfBytes = await pdfDoc.save();
  downloadPdf(pdfBytes);
  group.value = [];
  loading.value = false;
}
</script>

<template>
  <q-card>
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 q-mr-md">Fazer união de anexos</div>
    </q-card-section>
    <q-card-section>
      Selecione as opções de anexos na sequencia desejada para a união.
    </q-card-section>
    <q-card-section horizontal>
      <q-card-section>
        <q-option-group
          v-model="group"
          :options="options"
          color="primary"
          type="checkbox"
        />
      </q-card-section>
      <template v-if="sequence.length">
        <q-separator vertical />
        <q-card-section>
          <div class="q-mb-sm">Sequência escolhida</div>
          <template v-for="(item, index) in sequence" :key="index">
            <q-chip color="primary" text-color="white">
              {{ `${index + 1}º ${item}` }}
            </q-chip>
          </template>
        </q-card-section>
      </template>
    </q-card-section>
    <q-separator />
    <q-card-actions align="center">
      <q-btn
        :loading="loading"
        label="Baixar"
        color="primary"
        @click="handleMerge"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped></style>
