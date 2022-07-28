<template lang="pug">
q-page(padding)
  .text-bold.text-h6 VUE EDT GRID EDITOR

  .row.q-mt-md.items-center
    .col-auto
      q-btn(size="sm" :disabled="countRowsToDelete > 0" label="Adicionar Linha" @click="addNewRecord")
    .col-auto
      q-btn(size="sm" :disabled="countRowsToDelete !== 1" label="Adicionar Linha Acima de" @click="addNewRecordAt")
    //- .col-auto
    //-   q-btn(size="sm" :disabled="countRowsToDelete === 0" label="Excluir Linhas" @click="deleteSelectedRows")

  .row
    .col
      VueEdtGridEditor(
        ref="grid"
        :rows="tmodels.rows"
        :columns="tmodels.columns"
        style="width: 350px; height: 250px"
        @onKeyDown="onKeyDown"
      )
        template(v-slot:default="slotProps")
          | {{formatColumn(slotProps.field.column, slotProps.field.value)}}

    .col-auto(style="max-width: 300px")
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

import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import VueEdtGridEditor from 'src/components/VueEdtGridEditor/VueEdtGridEditor.vue'
import { Format, Units } from 'formatum'

export default {
  components: {
    VueEdtGridEditor
  },
  setup () {
    const grid = ref(null)

    const tmodels = reactive({
      stylecolautonumber: {
        width: '0px'
      },
      columns: [],
      rows: [],
      fieldModel: '',
      currentRowPos: 0,
      currentColPos: 0
    })

    const setupModels = reactive({
      moveTo: {
        row: 0,
        col: 0
      }
    })

    onMounted(async () => {
      createGridData()

      nextTick(() => {
        // const name = 'div' + 1 + 0
        // const element = document.getElementById(name)
        // if (element) {
        //   element.addEventListener('keypress', divKeyPress)
        //   // element.addEventListener('focus', () => {
        //   //   console.log('focus received')
        //   // })
        // }
      })
    })

    const createGridData = () => {
      tmodels.columns = [
        {
          headerName: 'Nome',
          field: 'name',
          width: { width: '100px' },
          format: (value) => {
            return 'formated: ' + value
          }
        },
        {
          headerName: 'Direção',
          field: 'direction',
          width: { width: '100px' }
        },
        {
          headerName: 'Distância',
          field: 'distance',
          width: { width: '100px' }
        }
      ]

      tmodels.rows = [
        { name: 'Nome1', direction: '90', distance: 0, remove: false },
        { name: 'AABB', direction: '180', distance: 200, remove: false },
        { name: 'CCDD', direction: '270', distance: 200, remove: false },
        { name: 'AGAJ', direction: '0', distance: 200, remove: false }
      ]
    }

    const countRowsToDelete = computed(() => {
      let length = 0
      if (grid.value) {
        length = grid.value.selectedRowsIds().length
      }
      return length
    })

    const addNewRecord = () => {
      tmodels.rows.push({
        name: '',
        direction: '0',
        distance: 0,
        remove: false
      })
    }

    const addNewRecordAt = async () => {
      if (countRowsToDelete.value === 1) {
        const idx = grid.value.selectedRowsIds()[0]
        const lastCoord = {
          name: '',
          direction: '0',
          distance: 0,
          remove: false
        }
        const newArray = [
          ...tmodels.rows.slice(0, idx),
          lastCoord,
          ...tmodels.rows.slice(idx)
        ]
        tmodels.rows = newArray
      }
    }

    const moveTo = (idxrow, idxcol) => {
      const name = 'div' + Number(idxrow) + Number(idxcol)
      const element = document.getElementById(name)
      if (element) {
        element.focus()
      }
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
      grid,
      tmodels,
      setupModels,
      addNewRecord,
      addNewRecordAt,
      countRowsToDelete,
      moveTo,
      formatColumn: (column, value) => {
        let localValue = ''
        switch (column) {
          case 'direction':
            localValue = directionToText(value)
            break
          case 'distance':
            localValue = distanceToText(value)
            break
          default:
            localValue = value
            break
        }
        return localValue
      },
      onKeyDown: (value) => {
        console.log('onKeyDown: ', JSON.stringify(value))
        switch (value.key) {
          case 13:
          case 40:
            if (value.isLastRow) {
              addNewRecord()
            }
            break
        }
      },
      deleteSelectedRows: async () => {
        // models.rowsToRemove.forEach(idx => {
        //   const localRow = models.reconstObject.vertices[idx]
        //   if (localRow) { localRow.remove = true }
        // })
        // const localRows = models.reconstObject.vertices.filter(row => row.remove === false)
        // models.reconstObject.vertices = localRows
        // models.rowsToRemove = []

        // grid.value.prevPage()

        // reconstCoordinates.setReconstDataFromVertices(models.reconstObject.vertices)
        // reconstCoordinates.updateMapCoordinates()
        // models.reconstGeoJSON = reconstCoordinates.reconstGeoJSON
      }
    }
  }
}
</script>

<style scoped>

.grid {
  background: gainsboro;
}

input {
  cursor: cell;
}

.divip {
  position: absolute;
  height: 27px;
  width: 100px;
  z-index: 100;
}

.divip:hover {
  cursor: cell;
  border: none;
}

.divip:focus-within {
  border: 2px solid green;
  outline: none !important;
}

</style>
