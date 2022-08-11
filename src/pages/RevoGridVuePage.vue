<template lang="pug">
q-page (padding)
  .text-bold.text-h6 Revo Grid Vue

  .row.q-mt-md.items-center
    .col-auto
      q-btn(size="sm" :disabled="countRowsToDelete > 0" label="Adicionar Linha" @click="addNewRecord")
    //- .col-auto
    //-   q-btn(size="sm" :disabled="countRowsToDelete !== 1" label="Adicionar Linha Acima de" @click="addNewRecordAt")
    //- .col-auto
    //-   q-btn(size="sm" :disabled="countRowsToDelete === 0" label="Excluir Linhas" @click="deleteSelectedRows")

  .row.q-mt-md
    .col
      VGrid(
        ref="grid"
        style="height: 300px; width: 100%;"
        :columns="models.columns"
        :source="models.items"
        @afteredit="afteredit"
        @beforeedit="beforeedit"
      )

</template>

<script>
import { defineComponent, onMounted, ref, reactive, computed } from 'vue'
import VGrid from '@revolist/vue3-datagrid'
import { Format, Units } from 'formatum'

export default defineComponent({
  components: {
    VGrid
  },
  setup () {
    const models = reactive({
      columns: [],
      items: [
        {
          name: 'Source',
          details: 'Item description'
        }
      ],
      rowsToRemove: []
    })

    const grid = ref()
    onMounted(() => {
      const columns = [
        {
          prop: 'delete',
          size: 30,
          cellTemplate: (h, props) => {
            return h(
              'i',
              {
                class: {
                  'fas fa-trash-alt': true
                },
                style: {
                  cursor: 'pointer'
                },
                onClick: () => deleteSelectedRow(props.rowIndex)
              },
              ''
            )
          }
        },
        {
          name: 'Nome',
          prop: 'name',
          width: 'auto'
        },
        {
          name: 'Direção',
          prop: 'direction',
          width: 140,
          cellTemplate: (createElement, props) => {
            return createElement(
              'div',
              {

              },
              directionToText(props.model[props.prop])
            )
          }
        },
        {
          name: 'Distância',
          prop: 'distance',
          width: 120,
          cellTemplate: (createElement, props) => {
            return createElement(
              'div',
              {

              },
              distanceToText(props.model[props.prop])
            )
          }
        }
      ]

      models.columns = [...columns]
    })

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

    const deleteSelectedRow = async (rowIndex) => {
      const localRow = models.reconstObject.vertices[rowIndex]
      if (localRow) { localRow.remove = true }

      const localRows = models.reconstObject.vertices.filter(row => row.remove === false)
      models.reconstObject.vertices = localRows
      models.rowsToRemove = []
    }

    const countRowsToDelete = computed(() => {
      return models.rowsToRemove.length
    })

    const addNewRecord = () => {
      console.log('addNewRecord')
      models.items.push({
        name: 'Mouse',
        details: 'My big mouse'
      })
      models.items = [...models.items]
    }

    return {
      grid,
      models,
      countRowsToDelete,
      addNewRecord,
      afteredit (ev) {
        console.log(ev)
      },
      beforeedit (e) {
        console.log(e)
        e.detail.val = e.detail.val.toUpperCase()
      }
    }
  }
})
</script>
