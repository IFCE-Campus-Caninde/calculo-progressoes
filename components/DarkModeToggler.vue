<template>
  <Button
    variant="outlined"
    rounded
    aria-label="Alternar Modo Escuro"
    @click="() => toggleDark()"
  >
    <template #icon>
      <Icon
        :name="
          isDark ? 'material-symbols:sunny' : 'material-symbols:moon-stars'
        "
        class="text-2xl"
      />
    </template>
  </Button>
</template>

<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<style scoped></style>
