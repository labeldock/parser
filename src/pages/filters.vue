<template>
  <main>
      <div class="filters-items">
        <ul>
          <template>
            <li>
              <button @click="insertFilter(0)">append</button>
            </li>
          </template>
          <template v-if="structs.length">
            <template v-for="(struct,index) in structs">
              <li>
                <parser :model="struct"></parser>
              </li>
              <li>
                <button @click="insertFilter(index+1)">append</button>
              </li>
            </template>
          </template>
        </ul>
      </div>
      <div class="filters-middlebar">
        <button>run</button>
      </div>
      <div class="filters-result">
        No result
      </div>
  </main>
</template>

<script>
import parser from "@/components/parser.vue"
import bow from "@/utils/bow";

let idx = 0;

export default {
  name: 'filters',
  components: {
    parser
  },
  mounted (){
    console.log("bow window")
    window.bow = bow;
  },
  data () {
    return {
      structs:[]
    }
  },
  methods:{
    insertFilter (index){
      bow.insertOf(this.structs,{title:idx++},index);
    }
  }
}
</script>

<style lang="scss">
@import '../scss/preset.scss';
.filters-items {
  > ul {
    @include list-variant;
    > li {
      
    }
  }
}
.filters-middlebar {
  
}
.filters-result {
  
}
</style>