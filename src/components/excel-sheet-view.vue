<template>
  <div>
    <h4>
      {{value.name}}
    </h4>
    <pre v-html="preContent"></pre>
  </div>
</template>
<script>
export default {
  props: ['value'],
  model: {
    prop: 'value',
    event: 'change'
  },
  computed:{
    preContent:e=>JSON.stringify(e.value.content,2,2)
  },
  data (){
    return {};
  }
}
</script>