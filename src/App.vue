<template>
  <div id="master-container">
    <header id="master-header">
      <gnb></gnb>
    </header>
    <router-view/>
  </div>
</template>

<script>
import gnb from '@/layout/gnb'
  
export default {
  name: 'App',
  components: { gnb }
}
</script>

<style lang="scss">
@import 'scss/preset.scss';
body {
  margin:0;
}

#master-container {
  
}

#master-header {
  border-bottom:1px solid silver;
  height:40px;
  padding:0 20px;
}

#gnb {
  @include list-variant;
  > li {
    @include inline-block;
    + li {
      margin-left:10px;
    }
  }
}

main {
  padding:20px;
}
</style>
