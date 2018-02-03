<template>
  <div>
    <button @click="info"></button>
    <input class="v-excel-parser" type="file">
  </div>
</template>
<script>
import $ from 'jquery';
import Promise from 'bluebird';

export default {
  mounted (){
    this.$input = $(this.$el).find(".v-excel-parser")[0];
    
    $(this.$input).on("change",this.info);
  },
  methods:{
    info (){
      let file = this.$input.files[0]
      console.log("file",file)
    }
  }
}
</script>
<style scoped>
  
</style>