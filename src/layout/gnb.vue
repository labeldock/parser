<template>
  <menu id="gnb">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/filters">Filters</router-link></li>
      <li><router-link to="/arguments">Arguments</router-link></li>
      <li><router-link to="/urls">Urls</router-link></li>
  </menu>
</template>

<script>
export default {
  name: 'gnb'
}
</script>