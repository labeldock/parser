<template>
  <main>
      <div>
        <excel-input @change-sheets="sheets = $event"></excel-input>
        <ul>
          <li v-for="(sheet, index) in sheets">
            <excel-sheet-view v-model="sheets[index]"></excel-sheet-view>
          </li>
        </ul>
      </div>
  </main>
</template>

<script>
import ExcelInput from "@/components/excel-input.vue"
import ExcelSheetView from "@/components/excel-sheet-view.vue"

export default {
  name: 'excel',
  components:{
    ExcelInput, 
    ExcelSheetView
  },
  data () {
    return {
      sheets:[]
    }
  }
}
</script>