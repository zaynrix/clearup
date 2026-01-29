<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import NavigationBar from './shared/components/NavigationBar.vue'

const route = useRoute()
const showNavigationBar = computed(() => route.name !== 'admin-dashboard')
</script>

<template>
  <div id="app">
    <NavigationBar v-if="showNavigationBar" />
    <RouterView />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
</style>
