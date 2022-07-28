<template lang="pug">
q-page (padding)
  .text-bold.text-h6 Revo Grid

  revo-grid(
    ref="grid"
    style="height: 300px; width: 100%;"
    :columns.prop="columns"
    :source.prop="models.items"
    @afteredit="afteredit"
    @beforeedit="beforeedit"
  )

</template>

<script>
import { defineComponent, onMounted, ref, reactive } from 'vue'

export default defineComponent({
  setup () {
    const columns = [
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
    ]

    const models = reactive({
      items: [
        {
          name: 'Source',
          details: 'Item description'
        }
      ]
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

    return {
      grid,
      columns,
      models,
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
