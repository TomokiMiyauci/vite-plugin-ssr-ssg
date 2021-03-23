<template>
  <div>
    <router-link to="/about">About</router-link>

    <h1>Index</h1>
    <p>This is Home page</p>
    <button @click="count++">{{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Index'
})

const count = ref(0)
</script>
