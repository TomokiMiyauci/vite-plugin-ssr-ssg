<template>
  <router-link to="/about">About</router-link>
  <button @click="count++">{{ count }}</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
