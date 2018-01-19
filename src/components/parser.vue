<template>
  <div class="parser">
    <div class="parser-from">
      <select v-model="fromSelected" @change="changeFromSelect(fromSelected)">
        <option disabled :value="null">Please select one</option>
        <option v-for="opt in fromOptions" :value="opt" >{{opt}}</option>
      </select>
      {{fromSelected}}
      <textarea v-model="fromValue" @keyup="parseAction" :readOnly="!fromSelected" :placeholder="!fromSelected ? 'Please select one': false"></textarea>
    </div>
    <div class="parser-break">
      <button :disabled="(!fromSelected || !toSelected)">&gt;</button>
    </div>
    <div class="parser-to">
      <select v-model="toSelected">
        <option disabled :value="null">Please select one</option>
        <option v-for="opt in toOptions" :value="opt" >{{opt}}</option>
      </select>
      {{toSelected}}
      <textarea v-model="toValue" readOnly></textarea>
    </div>
  </div>
</template>

<script>
import _   from "lodash";
import bow from "@/utils/bow";
import YAML from "node-yaml";

export default {
  name: 'parser',
  props: ["model"],
  data () {
    return {
      fromSelected:null,
      toSelected:null,
      fromValue:"",
      toValue:"",
      output:null,
      allOptions:[
        "curl",
        "swagger",
        "json",
        "yaml"
      ]
    }
  },
  computed:{
    fromOptions (){
      return this.allOptions.filter(opt=>opt!==this.toSelected);
    },
    toOptions (){
      return this.allOptions.filter(opt=>opt!==this.fromSelected);
    }
  },
  methods:{
    changeFromSelect (value){
      switch(value){
        case "json":
          this.toSelected = "yaml";
          break;
        case "yaml":
          this.toSelected = "json";
        case "curl":
          this.toSelected = "swagger";
          break;
        default:
          console.warn("unknown")
          break;
      }
    },
    parse (){
      let mode = `${this.fromSelected}-${this.toSelected}`;
      
      switch(this.fromSelected){
        case "curl-swagger":
          break;
        case "json":
          this.output = JSON.parse(this.fromValue);
          break;
        case "yaml":
          this.output = YAML.parse(this.fromValue);
          break;
        default:
          console.warn("unknown")
          break;
      }
      
      switch(this.toSelected){
        case "yaml":
          this.toValue = "sorry";
          break;
        case "json":
          this.toValue = JSON.stringify(this.output,2,2);
          break;
        case "swagger":
          if(this.output){
            
          }
          break;
      }
    },
    parseAction:_.debounce(function(){this.parse()}, 2000)
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