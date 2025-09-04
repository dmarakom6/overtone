<script setup lang="ts">
import { ref } from "vue";
import FileUpload from "./components/FileUpload.vue";

const uploadedFiles = ref<File[]>([]);

function handleFilesChanged(files: File[]) {
  uploadedFiles.value = files;
  processFiles();
}

async function processFiles() {
  for (const file of uploadedFiles.value) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/process", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert(`Failed to process ${file.name}`);
        continue;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // trigger browser download
      const a = document.createElement("a");
      a.href = url;
      a.download = `processed-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(`Error processing ${file.name}`);
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <header class="p-4 border-b border-border">
      <h1 class="text-2xl font-bold">Overtone</h1>
    </header>

    <main class="flex-grow p-4">
      <FileUpload multiple @changed="handleFilesChanged" />
      <p class="mt-4">Welcome to Overtone!</p>
      <p>
        Upload your MP3 files and press "Submit" to normalize & process them.
        Processed files will be downloaded automatically.
      </p>
    </main>

    <footer class="p-4 border-t border-border text-center">
      <p>&copy; {{ new Date().getFullYear() }} Overtone</p>
    </footer>
  </div>
</template>
