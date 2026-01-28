<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationBar from './layers/presentation/components/NavigationBar.vue'
</script>

<template>
  <div id="app">
    <NavigationBar />
    <RouterView />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
</style>
