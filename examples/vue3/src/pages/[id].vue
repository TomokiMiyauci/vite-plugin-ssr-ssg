<template>
  <h1>{{ id }}</h1>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const id = computed(() => useRoute().params.id)
</script>
