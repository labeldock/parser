<template>
  <menu id="gnb">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/filters">Filters</router-link></li>
      <li><router-link to="/excel">Excel</router-link></li>
  </menu>
</template>

<script>
export default {
  name: 'gnb'
}
</script>