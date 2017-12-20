<template>
  <div class="background">
    <!-- <img :src="'static/img/welcome/9.jpeg'"/> -->
    <h1>Bienvenue sur Azuroams V3</h1>
  </div>
</template>
<script>
  export default {
  }
</script>
<style lang="scss" scoped>
  .background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
    overflow-x: hidden;
    padding: 15px 0 0 110px;
    background-color: white;
    background-image: url("/static/img/welcome/9.jpeg");
  }
</style>