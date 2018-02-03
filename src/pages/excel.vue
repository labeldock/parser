<template>
  <main>
      <div>
        <excel-input></excel-input>
        
        <excel-view></excel-view>
      </div>
  </main>
</template>

<script>
import ExcelInput from "@/components/excel-input.vue"
import ExcelView from "@/components/excel-view.vue"

export default {
  name: 'excel',
  components:{
    ExcelInput, ExcelView
  },
  data () {
    return {}
  }
}
</script>