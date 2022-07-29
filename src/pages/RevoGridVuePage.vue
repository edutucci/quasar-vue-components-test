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

export default defineComponent({
  components: {
    VGrid
  },
  setup () {
    const models = reactive({
      columns: [
        // first column with dropdown
        {
          // binding prop
          prop: 'name',
          // column name
          name: 'First',
          // column size
          size: 150
        },
        {
          prop: 'details',
          name: 'Second column',
          size: 200
        }
      ],
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
      // grid = document.querySelector('revo-grid')

      // rows collection

      // define your custom column type here
      // grid.columnTypes = {
      //   select: new window.RevoGridColumnSelect.CreateSelectColumnType()
      // }
      // apply columns
      // grid.value.columns = columns
      // apply rows
      // grid.value.source = items
    })

    const countRowsToDelete = computed(() => {
      return models.rowsToRemove.length
    })

    const addNewRecord = () => {
      console.log('addNewRecord')
      models.items.push({
        name: 'Mouse',
        details: 'My big mouse'
      })
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
