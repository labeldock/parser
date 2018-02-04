<template>
  <div>
    <h4>
      {{value.name}}
    </h4>
    <b>meta</b>
    <pre v-html="preMeta"></pre>
    <b>content</b>
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
    preMeta:e=>JSON.stringify(e.value.meta,2,2),
    preContent:e=>JSON.stringify(e.value.content,2,2)
  },
  data (){
    return {};
  }
}
</script>