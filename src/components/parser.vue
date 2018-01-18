<template>
  <div class="parser">
    <div class="parser-from">
      <select v-model="fromSelected">
        <option disabled :value="null">Please select one</option>
        <option :value="opt" v-for="opt in fromOptions">{{opt.label}}</option>
      </select>
      <textarea></textarea>
    </div>
    <div class="parser-break"><span>{{model.title}}</span><span>&gt;</span></div>
    <div class="parser-to">
      <select>
        <option disabled :value="null">Please select one</option>
        <option v-for="opt in toOptions">{{opt.label}}</option>
      </select>
      <textarea readOnly></textarea>
    </div>
  </div>
</template>

<script>
import bow from "@/utils/bow";
export default {
  name: 'parser',
  props: ["model"],
  data () {
    return {
      fromSelected:null,
      allOptions:[
        {key:"json", label:"json"},
        {key:"yaml", label:"yaml"}
      ]
    }
  },
  computed:{
    fromOptions (){
      return [];
    },
    toOptions (){
      return [];
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/preset.scss';
.parser {
  @include clearfix;
  width:100%;
  border:1px solid silver;
  padding:10px;
  
  .parser-from, .parser-break, .parser-to {
    float:left;
  }
  
  .parser-break {
    position:relative;
    text-align:center;
    width:5%;
  }
  
  .parser-from, .parser-to {
    width:47.5%;
    textarea {
      width:100%;
      min-height:120px;
    }
  }
}
</style>