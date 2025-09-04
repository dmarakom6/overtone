<template>
  <div class="space-y-4 flex flex-col items-center justify-center">
    <label
      for="file-input"
      class="btn text-2xl border-2 border-primary rounded-md p-2 cursor-pointer"
    >
      Upload File
    </label>

    <input
      id="file-input"
      type="file"
      :multiple="multiple"
      @change="handleFileSelect"
      hidden
    />

    <ul>
      <li v-for="(file, index) in files" :key="file.name" class="flex gap-2">
        {{ file.name }}
        <Button @click="removeFile(index)" >Remove</Button>
      </li>
    </ul>

    <Button
      v-if="files.length > 0"
      class="mt-4 p-3 font-bold text-accent-foreground bg-accent"
      @click="submitFiles"
    >
      Submit
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "./ui/button/Button.vue";

defineProps<{
  multiple?: boolean;
}>();

const files = ref<File[]>([]);

const emit = defineEmits<{
  (e: "changed", files: File[]): void;
}>();

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const filesAsArray = Array.from(input?.files || []);
  files.value = files.value.concat(filesAsArray);
}

function removeFile(index: number) {
  files.value.splice(index, 1);
}

function submitFiles() {
  // only mp3s
  const mp3Files = files.value.filter(
    (file) => file.type === "audio/mpeg" || file.name.endsWith(".mp3")
  );

  if (mp3Files.length === 0) {
    alert("No MP3 files to process.");
    return;
  }

  emit("changed", mp3Files);
}
</script>
