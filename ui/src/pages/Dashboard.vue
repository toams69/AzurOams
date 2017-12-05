<template>
  <main-layout></main-layout>
</template>
<script>
  import MainLayout from '@/layouts/MainLayout.vue'
  export default {
    components: {
      MainLayout
    },
    methods: {
    },
    mounted () {
      this.$store.dispatch('GET_CONFIGURATION')
      this.$store.dispatch('GET_CONTACTS')
      this.$store.dispatch('GET_FAMILLES')
    }
  }
</script>
<style>
</style>