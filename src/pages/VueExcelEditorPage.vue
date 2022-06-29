<template lang="pug">
q-page(padding)

  .row
    .col
      .row
        .col
          q-btn(size="sm" label="Restore" @click="restore")
          q-btn(size="sm" label="NewRecord" @click="addNewRecord")
          q-btn(size="sm" v-if="countRowsToDelete > 0" label="Delete" @click="deleteSelectedRows")

      .row
        .col
          VueExcelEditor.q-mt-sm(
            height='300px'
            v-model="models.rows"
            ref="grid"
            @select="rowSelected"
            @unSelect="unSelect"
            @update="cellUpdate"
            @cellClick="cellClick"
            :multiUpdate="models.multiUpdate"
            @onKeyDown="onKeyDown"
            enterToNextRow
          )
            VueExcelColumn(field="name" label="Name")
            VueExcelColumn(field="phone" label="Phone")
            VueExcelColumn(field="gender" label="Gender" type="select" :options="['M', 'F']")
            VueExcelColumn(field="age" label="Age")
            VueExcelColumn(field="birth" label="Birth")
    .col-auto(style="max-width: 300px")
      .text-bold.text-h6 Behavior
      hr
      q-toggle(disable v-model="hasScroll" label="has Scroll?")
      br
      q-toggle(v-model="models.multiUpdate" label="Multi Update")

      .text-bold.text-h6 Move To
      hr
      .row.items-center
        .col.q-pr-sm
          q-input(dense mask="###" v-model="setupModels.moveTo.row" label="row" style="max-width: 50px")
        .col.q-pr-sm
          q-input(dense mask="###" v-model="setupModels.moveTo.col" label="col" style="max-width: 50px")
        .col-auto
          q-btn(size="sm" label="Ok" @click="moveTo(setupModels.moveTo.row, setupModels.moveTo.col)")

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
      multiUpdate: false,
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

    const setupModels = reactive({
      moveTo: {
        row: 0,
        col: 0
      }
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

    const hasScroll = computed(() => {
      return (grid.value) ? grid.value.hasScroll() : false
    })

    return {
      countRowsToDelete,
      grid,
      models,
      setupModels,
      setRowsToDelete,
      hasScroll,
      restore: () => {
        models.rows = []
        models.restore.forEach((rec) => {
          models.rows.push({
            name: rec.name,
            phone: rec.phone,
            gender: rec.gender,
            age: rec.age,
            birth: rec.birth
          })
        })
      },
      rowSelected: (rows) => {
        setRowsToDelete(rows, true)
      },
      unSelect: (rows) => {
        setRowsToDelete(rows, false)
      },
      deleteSelectedRows: (value) => {
        models.rows = models.rows.filter(row => row.remove === false)
      },
      addNewRecord: () => {
        grid.value.newRecord({}, false)
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
        // console.log('cellClick', JSON.stringify(value))
      },
      onKeyDown: (value) => {
        console.log('onKeyDown', JSON.stringify(value))
        // grid.value.moveTo(2, 0)
      },

      // SETUP FUNCTIONS
      moveTo: (row, col) => {
        grid.value.moveTo(Number(row), Number(col))
      }
    }
  }
}
</script>
