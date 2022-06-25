<template lang="pug">
q-page(padding)
  <h6>VUE EXCEL EDITOR</h6>

  VueExcelEditor(v-model="models.rows"
    ref="grid"
    @select="rowSelected"
    @unSelect="unSelect"
    @deleteSelectedRecords="deleteSelectedRecords"
  )
    VueExcelColumn(field="user" label="User")
    VueExcelColumn(field="name" label="Name")
    VueExcelColumn(field="phone" label="Phone")
    VueExcelColumn(field="gender" label="Gender" type="select" :options="['M', 'F']")
    VueExcelColumn(field="age" label="Age")
    VueExcelColumn(field="birth" label="Birth")
</template>

<script>

import { ref, reactive, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
import VueExcelEditor from '../components/VueExcelEditor/VueExcelEditor'

export default {
  components: {
    VueExcelEditor
  },
  setup () {
    const grid = ref(null)
    const models = reactive({
      rows: [
        { id: 0, user: 'hc', name: 'Harry Cole', phone: '1-415-2345678', gender: 'M', age: 25, birth: '1997-07-01', remove: false },
        { id: 1, user: 'sm', name: 'Simon Minolta', phone: '1-123-7675682', gender: 'M', age: 20, birth: '1999-11-12', remove: false },
        { id: 2, user: 'ra', name: 'Raymond Atom', phone: '1-456-9981212', gender: 'M', age: 19, birth: '2000-06-11', remove: false },
        { id: 3, user: 'ag', name: 'Mary George', phone: '1-556-1245684', gender: 'F', age: 22, birth: '2002-08-01', remove: false },
        { id: 4, user: 'kl', name: 'Kenny Linus', phone: '1-891-2345685', gender: 'M', age: 29, birth: '1990-09-01', remove: false }
      ]
    })

    onMounted(async () => {
    })

    return {
      grid,
      models,
      rowSelected: (value) => {
        console.log('row selected: ', JSON.stringify(value))
        // // console.log('rows: ', JSON.stringify(models.rows))

        // const rowSelected = grid.value.getSelectedRecords()
        // console.log('rowSelected: ', JSON.stringify(rowSelected))
      },
      unSelect: (value) => {
        console.log('row unSelected: ', JSON.stringify(value))
      },
      deleteSelectedRecords: (value) => {
        console.log('deleteSelectedRecords: ', JSON.stringify(value))
      }
    }
  }
}
</script>
