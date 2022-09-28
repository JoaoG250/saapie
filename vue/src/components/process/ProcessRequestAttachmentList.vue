<script setup lang="ts">
interface Files {
  [key: string]: string[];
}
interface ProcessRequestAttachmentListProps {
  files: Files;
}
defineProps<ProcessRequestAttachmentListProps>();

function downloadFile(url: string) {
  const filename = url.split("/").pop();
  if (!filename) return;
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function getIcon(fileUrl: string) {
  if (fileUrl.match(/.pdf$/i)) {
    return "picture_as_pdf";
  } else if (fileUrl.match(/.(jpg|jpeg|png)$/i)) {
    return "collections";
  }
  return "description";
}
</script>

<template>
  <div class="row q-col-gutter-md justify-center">
    <div
      v-for="(urls, field) in files"
      :key="field"
      class="col-12 col-sm-6 col-md-4"
    >
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-center">
            {{ field.toString() }}
          </div>
        </q-card-section>
        <q-list>
          <q-item v-for="(url, index) in urls" :key="index">
            <q-item-section avatar>
              <q-icon :name="getIcon(url)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Anexo {{ index + 1 }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="q-gutter-xs">
                <q-btn
                  :href="url"
                  target="_blank"
                  icon="visibility"
                  flat
                  dense
                  round
                />
                <q-btn
                  icon="file_download"
                  flat
                  dense
                  round
                  @click="downloadFile(url)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </div>
</template>

<style scoped></style>
