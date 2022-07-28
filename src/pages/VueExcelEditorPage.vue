<template lang="pug">
q-page(padding)
  div
    | {{models.rows}}
  .row
    .col
      .row
        .col
          q-btn(size="sm" label="Restore" @click="restore")
          q-btn(size="sm" label="NewRecord" @click="addNewRecord")
          q-btn(size="sm" v-if="countRowsToDelete > 0" :label="`Delete (${countRowsToDelete})`" @click="deleteSelectedRows")

      .row
        .col
          VueExcelEditor.q-mt-sm(
            height="300px"
            v-model="models.rows"
            ref="grid"
            @select="rowSelected"
            @unSelect="unSelect"
            @update="cellUpdate"
            :multiUpdate="models.multiUpdate"
            @onKeyDown="onKeyDown"
            @beginEdit="onBeginEdit"
            @endEdit="onEndEdit"
            enterToNextRow
          )
            VueExcelColumn(field="name" label="Name")
            VueExcelColumn(field="direction" label="Direction" :to-text="directionToText")
            VueExcelColumn(field="distance" label="Distance" :to-text="distanceToText")

    .col-auto(style="max-width: 300px")
      .text-bold.text-h6 Behavior
      hr
      q-toggle(disable v-model="hasScroll" label="has Scroll?")
      br
      q-toggle(v-model="models.multiUpdate" label="Multi Update")
      br
      q-toggle(v-model="models.editingMode" label="Editing cells?")

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
import { Format, Units } from 'formatum'

export default {
  components: {
    VueExcelEditor
  },
  setup () {
    const grid = ref(null)
    const models = reactive({
      editingMode: false,
      rowsToRemove: [],
      multiUpdate: false,
      rows: [
        { name: 'Nome1', direction: '90', distance: 0, remove: false },
        { name: 'AABB', direction: '180', distance: 200, remove: false },
        { name: 'CCDD', direction: '270', distance: 200, remove: false },
        { name: 'AGAJ', direction: '0', distance: 200, remove: false }
      ],
      restore: [
        { name: 'Nome1', direction: '90', distance: '200', remove: false },
        { name: 'AABB', direction: '180', distance: '200', remove: false },
        { name: 'CCDD', direction: '270', distance: '200', remove: false },
        { name: 'AGAJ', direction: '0', distance: '200', remove: false }
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

    const setRowsToDelete = (rows) => {
      for (let idx = 0; idx < rows.length; idx++) {
        const index = models.rowsToRemove.findIndex(item => item === (rows[idx]))
        if (index === -1) {
          models.rowsToRemove.push(rows[idx])
        } else {
          models.rowsToRemove.splice(index, 1)
        }
      }
    }

    const countRowsToDelete = computed(() => {
      return models.rowsToRemove.length
    })

    const hasScroll = computed(() => {
      return (grid.value) ? grid.value.hasScroll() : false
    })

    const addNewRecord = () => {
      grid.value.newRecord({ name: '', direction: 0, distance: 0, remove: false })
    }

    const directionToText = (value) => {
      try {
        return Format.valueToUnit(value, Units.DegreeMinuteSecond)
      } catch (error) {
        return Format.valueToUnit(0, Units.DegreeMinuteSecond)
      }
    }

    const distanceToText = (value) => {
      try {
        return Format.valueToUnit(value, Units.Meters)
      } catch (error) {
        return Format.valueToUnit(0, Units.Meters)
      }
    }

    return {
      countRowsToDelete,
      grid,
      models,
      setupModels,
      setRowsToDelete,
      hasScroll,
      addNewRecord,
      directionToText,
      distanceToText,
      restore: () => {
        models.rowsToRemove = []
        models.rows = []
        models.restore.forEach((rec) => {
          models.rows.push({
            name: rec.name,
            remove: rec.remove,
            direction: rec.direction,
            distance: rec.distance
          })
        })
      },
      rowSelected: (rows) => {
        setRowsToDelete(rows)
      },
      unSelect: (rows) => {
        setRowsToDelete(rows)
      },
      deleteSelectedRows: () => {
        models.rowsToRemove.forEach(idx => {
          const localRow = models.rows[idx]
          if (localRow) { localRow.remove = true }
        })
        const localRows = models.rows.filter(row => row.remove === false)
        models.rows = localRows
        models.rowsToRemove = []
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
      onBeginEdit: (value) => {
        console.log('onBeginEdit value: ', value)
        models.editingMode = true
      },
      onEndEdit: (value) => {
        console.log('onEndEdit value: ', value)
        models.editingMode = false
      },
      onKeyDown: (value) => {
        switch (value.key) {
          case 13:
          case 40:
            if (value.rowPos === value.tableLength && !models.editingMode) {
              addNewRecord()
            }
            break
        }
      },

      // SETUP FUNCTIONS
      moveTo: (row, col) => {
        grid.value.moveTo(Number(row), Number(col))
      }
    }
  }
}
</script>
