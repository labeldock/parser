<template>
  <div>
    <button @click="info"></button>
    <input class="v-excel-parser" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
  </div>
</template>
<script>
import $ from 'jquery';
import Promise from 'bluebird';
import XLSX from 'xlsx';

const importFromExcel = function(file){
  var reader = new FileReader();
  return new Promise(resolve=>{
    reader.onload = function(e){
      var data   = e.target.result;
      var result = XLSX.read(data, {type: 'array'});
      resolve(result);
    }
    reader.readAsArrayBuffer(file);
  })
}

export default {
  mounted (){
    this.$input = $(this.$el).find(".v-excel-parser")[0];
    $(this.$input).on("change",this.info);
  },
  methods:{
    info (){
      let file = this.$input.files[0];
      
      importFromExcel(file).then(e=>{
        let sheets = [];
        
        Object.keys(e.Sheets).forEach(key=>{
          let sheet = {name:key, content:{ ...e.Sheets[key] }};
          sheets.push(sheet)
        });
        
        console.log("sheets",sheets);
        
        this.$emit("change",e);
        this.$emit("change-sheets",sheets);
      });
    }
  }
}
</script>