<template lang="pug">
q-page(padding)
  <h6>VUE EXCEL EDITOR</h6>

  .row
    .col-auto
      q-btn(size="sm" label="Restore" @click="models.rows = models.restore")
    .col-auto
      q-btn(size="sm" v-if="countRowsToDelete > 0" label="Delete" @click="deleteSelectedRows")

  VueExcelEditor.q-mt-sm(v-model="models.rows"
    ref="grid"
    @select="rowSelected"
    @unSelect="unSelect"
    @update="cellUpdate"
    @cellClick="cellClick"
  )
    VueExcelColumn(field="user" label="User")
    VueExcelColumn(field="name" label="Name")
    VueExcelColumn(field="phone" label="Phone")
    VueExcelColumn(field="gender" label="Gender" type="select" :options="['M', 'F']")
    VueExcelColumn(field="age" label="Age")
    VueExcelColumn(field="birth" label="Birth")
</template>

<script>

import { ref, reactive, onMounted, computed } from 'vue'
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
        { user: 'hc', name: 'Harry Cole', phone: '1-415-2345678', gender: 'M', age: 25, birth: '1997-07-01', remove: false },
        { user: 'sm', name: 'Simon Minolta', phone: '1-123-7675682', gender: 'M', age: 20, birth: '1999-11-12', remove: false },
        { user: 'ra', name: 'Raymond Atom', phone: '1-456-9981212', gender: 'M', age: 19, birth: '2000-06-11', remove: false },
        { user: 'ag', name: 'Mary George', phone: '1-556-1245684', gender: 'F', age: 22, birth: '2002-08-01', remove: false },
        { user: 'kl', name: 'Kenny Linus', phone: '1-891-2345685', gender: 'M', age: 29, birth: '1990-09-01', remove: false }
      ],
      restore: [
        { user: 'hc', name: 'Harry Cole', phone: '1-415-2345678', gender: 'M', age: 25, birth: '1997-07-01', remove: false },
        { user: 'sm', name: 'Simon Minolta', phone: '1-123-7675682', gender: 'M', age: 20, birth: '1999-11-12', remove: false },
        { user: 'ra', name: 'Raymond Atom', phone: '1-456-9981212', gender: 'M', age: 19, birth: '2000-06-11', remove: false },
        { user: 'ag', name: 'Mary George', phone: '1-556-1245684', gender: 'F', age: 22, birth: '2002-08-01', remove: false },
        { user: 'kl', name: 'Kenny Linus', phone: '1-891-2345685', gender: 'M', age: 29, birth: '1990-09-01', remove: false }
      ]
    })

    onMounted(async () => {
    })

    const setRowsToDelete = (rows, deleteMode) => {
      for (let idx = 0; idx < rows.length; idx++) {
        models.rows[rows[idx]].remove = deleteMode
        // console.log(rows[idx])
      }
    }

    const countRowsToDelete = computed(() => {
      return (models.rows.filter(row => row.remove === true)).length > 0
    })

    return {
      countRowsToDelete,
      grid,
      models,
      setRowsToDelete,
      rowSelected: (rows) => {
        setRowsToDelete(rows, true)
      },
      unSelect: (rows) => {
        setRowsToDelete(rows, false)
      },
      deleteSelectedRows: (value) => {
        models.rows = models.rows.filter(row => row.remove === false)
      },
      cellUpdate: (value) => {
        const fieldName = value[0] ? value[0].field.name : ''
        const rowPos = (value[0]) ? value[0].$rowPos : -1

        if (rowPos > -1) {
          switch (fieldName) {
            case 'birth':
              if ((rowPos + 1) < (models.rows.length)) {
                grid.value.moveTo(rowPos + 1, 0)
              }
              break
          }
        }
      },
      cellClick: (value) => {
      },
      moveTo: (value) => {
        grid.value.moveTo(3, 0)
      }
    }
  }
}
</script>
