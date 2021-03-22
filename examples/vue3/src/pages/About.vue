<template>
  <div>
    <router-link to="/">Home</router-link>

    <h1>About</h1>
    <p>This is about page.</p>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'About'
})
</script>
