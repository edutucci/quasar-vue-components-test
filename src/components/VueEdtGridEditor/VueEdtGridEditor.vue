<template lang="pug">

.column.grid
  .col-auto
    .row.no-wrap.items-center
      .col-auto(:style="cpcolautonumber")
      .col-auto.gridcolumn(v-for="(col, idxcol) in tmodels.columns" :key="idxcol" :style="[tmodels.columns[idxcol].width]")
        | {{tmodels.columns[idxcol].headerName}}
  .col(id="vueedtgrid" style="overflow: auto;")
    .row.no-wrap.items-center(v-for="(row, idxrow) in tmodels.rows" :key="idxrow" style="overflow: hidden;")
      .col-auto.text-center.divautoinc(
        :id="divid('divinc', idxrow, '')"
        class=""
        :style="cpcolautonumber"
        @click="selecteDivInc('divinc', idxrow, '')"
      )
        | {{idxrow+1}}
      .col-auto(v-for="(col, idxcol) in tmodels.columns" :key="idxcol" style="position:relative; overflow: hidden;" :style="[tmodels.columns[idxcol].width]")
        .divip(
          :id="divid('div', idxrow, idxcol )"
          tabindex="0"
          @focus="divfocus(idxrow, idxcol)"
          :style="[tmodels.columns[idxcol].width]"
          style="overflow: hidden;"
          @click="cellClick(idxrow, idxcol)"
          @blur="onblur(idxrow, idxcol)"
        )
          slot(:field="formatFieldTemplate(idxrow, idxcol)")
            | {{tmodels.rows[idxrow][tmodels.columns[idxcol].field]}}

        input(
          :id="divid('input', idxrow, idxcol)"
          tabindex="-1"
          v-model="tmodels.rows[idxrow][tmodels.columns[idxcol].field]"
          :style="[tmodels.columns[idxcol].width]"
          @input="inputChange(idxrow, idxcol, $event.target.value)"
          @blur="onblur(idxrow, idxcol)"
        )

</template>

<script>

import { reactive, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

export default {
  props: {
    rows: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup (props, context) {
    const tmodels = reactive({
      stylecolautonumber: {
        width: '0px'
      },
      columns: [],
      rows: [],
      fieldModel: '',
      currentRowPos: 0,
      currentColPos: 0,
      isInputFocused: false,
      selectedRowsIds: [],
      currentInput: {
        row: -1,
        col: -1
      }
    })

    onMounted(async () => {
      tmodels.rows = props.rows
      tmodels.columns = props.columns

      if (tmodels.rows) {
        for (let idx = 0; idx > tmodels.rows.length; idx++) {
          tmodels.rows[idx].id = idx
        }
      }

      nextTick(() => {
        const name = 'vueedtgrid'
        const element = document.getElementById(name)
        if (element) {
          element.addEventListener('keydown', divKeyPress)
        }
      })
    })

    onUnmounted(() => {
      const name = 'vueedtgrid'
      const element = document.getElementById(name)
      if (element) {
        element.removeEventListener('keydown', divKeyPress)
      }
    })

    watch(() => props.rows, () => {
      tmodels.rows = props.rows

      if (tmodels.rows) {
        for (let idx = 0; idx > tmodels.rows.length; idx++) {
          tmodels.rows[idx].id = idx
        }
      }
    })

    watch(() => props.columns, () => {
      tmodels.columns = props.columns
    })

    // GRID BEHAVIOR
    const cpcolautonumber = computed(() => {
      const value = { width: '18px', height: '25px', padding: '2px' }
      if (tmodels.rows) {
        const lastRowValue = '' + tmodels.rows.length
        value.width = '' + (lastRowValue.length * 18) + 'px'
      }
      return value
    })

    const divid = (name, idxrow, idxcol) => {
      return name + idxrow + idxcol
    }

    const selecteDivInc = (id, idxrow, idxcol) => {
      const name = id + idxrow + idxcol
      const element = document.getElementById(name)
      if (element) {
        element.classList.toggle('selected')
        const idx = tmodels.selectedRowsIds.findIndex(item => item === idxrow)
        if (idx === -1) {
          tmodels.selectedRowsIds.push(idxrow)
        } else {
          tmodels.selectedRowsIds.splice(idx, 1)
        }
      }
    }

    const formatFieldTemplate = (idxrow, idxcol) => {
      const fm = {
        column: tmodels.columns[idxcol].field,
        value: tmodels.rows[idxrow][tmodels.columns[idxcol].field]
      }
      return fm
    }

    const inputChange = (idxrow, idxcol, value) => {
      const field = tmodels.columns[idxcol].field
      tmodels.rows[idxrow][field] = value
    }

    const onblur = (idxrow, idxcol) => {
      const name = 'div' + idxrow + idxcol
      const element = document.getElementById(name)
      if (element) {
        element.style.visibility = 'visible'
        setCurrentInput(-1, -1)
      }
    }

    const divKeyPress = (WindowEvent) => {
      switch (WindowEvent.keyCode) {
        case 9: // tab
        case 33: // PageUp
        case 34: // PageDown
        case 35: // End
        case 45: // Insert
          break
        case 46: // Delete
          break
        case 38: // ArrowUp
          WindowEvent.preventDefault()
          if (!tmodels.isInputFocused) {
            moveUp(tmodels.currentRowPos, tmodels.currentColPos)
          }
          break
        case 40: // ArrowDown
          WindowEvent.preventDefault()
          if (!tmodels.isInputFocused) {
            onKeyDown(WindowEvent.keyCode)
            moveDown(tmodels.currentRowPos, tmodels.currentColPos)
          }
          break
        case 37: // ArrowLeft
          WindowEvent.preventDefault()
          if (!tmodels.isInputFocused) {
            moveLeft(tmodels.currentRowPos, tmodels.currentColPos)
          }
          break
        case 39: // ArrowRight
          WindowEvent.preventDefault()
          if (!tmodels.isInputFocused) {
            moveRight(tmodels.currentRowPos, tmodels.currentColPos)
          }
          break
        case 13:
          WindowEvent.preventDefault()
          if (!tmodels.isInputFocused) {
            setDivVisibility('hidden', tmodels.currentRowPos, tmodels.currentColPos)
            setFocusToInput(tmodels.currentRowPos, tmodels.currentColPos, false)
            setCurrentInput(tmodels.currentRowPos, tmodels.currentColPos)
          } else {
            tmodels.isInputFocused = false
            setDivVisibility('visible', tmodels.currentRowPos, tmodels.currentColPos)
            setCurrentInput(-1, -1)
            if (isLastColumn(tmodels.currentRowPos, tmodels.currentColPos)) {
              nextTick(() => {
                moveTo(tmodels.currentRowPos, tmodels.currentColPos)
              })
            } else {
              moveRight(tmodels.currentRowPos, tmodels.currentColPos)
            }
          }
          break
        case 27: // ESC
          setDivVisibility('visible', tmodels.currentRowPos, tmodels.currentColPos)
          tmodels.isInputFocused = false
          setCurrentInput(-1, -1)
          nextTick(() => {
            moveTo(tmodels.currentRowPos, tmodels.currentColPos)
          })
          break
        default:
          setDivVisibility('hidden', tmodels.currentRowPos, tmodels.currentColPos)
          setFocusToInput(tmodels.currentRowPos, tmodels.currentColPos)
          setCurrentInput(tmodels.currentRowPos, tmodels.currentColPos)
          break
      }
    }

    const divfocus = (idxrow, idxcol) => {
      tmodels.currentRowPos = idxrow
      tmodels.currentColPos = idxcol
    }

    const setDivVisibility = (visibility, idxrow, idxcol) => {
      const name = 'div' + idxrow + idxcol
      const element = document.getElementById(name)
      if (element) {
        element.style.visibility = visibility
      }
    }

    const cellClick = (idxrow, idxcol) => {
      setCurrentInput(idxrow, idxcol)
    }

    const setFocusToInput = (idxrow, idxcol, clearField = true) => {
      let result = false
      const inputName = 'input' + idxrow + idxcol
      const inputElement = document.getElementById(inputName)
      if (inputElement) {
        if (!tmodels.isInputFocused && clearField) {
          inputElement.value = ''
        }
        tmodels.isInputFocused = true
        result = true
        inputElement.focus()
      }
      return result
    }

    const setCurrentInput = (idxrow, idxcol) => {
      tmodels.currentInput = {
        row: idxrow,
        col: idxcol
      }
    }

    const isCurrentInput = (idxrow, idxcol) => {
      return tmodels.currentInput.row === idxrow && tmodels.currentInput.col === idxcol
    }

    const isFirstColumn = (idxrow, idxcol) => {
      return idxrow === 0 && idxcol === 0
    }

    const isLastColumn = (idxrow, idxcol) => {
      return idxrow === (tmodels.rows.length - 1) && idxcol === (tmodels.columns.length - 1)
    }

    const isFirstRow = (idxrow) => {
      return idxrow === 0
    }

    const isLastRow = (idxrow) => {
      return idxrow === (tmodels.rows.length - 1)
    }

    const moveLeft = (idxrow, idxcol) => {
      let localRowPos = idxrow
      let localColPos = idxcol
      if (isFirstColumn(idxrow, idxcol)) {
        return
      }

      if (localColPos === 0) {
        localColPos = tmodels.columns.length - 1
        localRowPos -= 1
      } else {
        localColPos -= 1
      }

      moveTo(localRowPos, localColPos)
    }

    const moveRight = (idxrow, idxcol) => {
      let localRowPos = idxrow
      let localColPos = idxcol
      if (isLastColumn(idxrow, idxcol)) {
        return
      }

      if (localColPos === tmodels.columns.length - 1) {
        localColPos = 0
        localRowPos += 1
      } else {
        localColPos += 1
      }

      moveTo(localRowPos, localColPos)
    }

    const moveDown = (idxrow, idxcol) => {
      let localRowPos = idxrow
      if (isLastRow(idxrow)) {
        return
      }
      localRowPos += 1
      moveTo(localRowPos, idxcol)
    }

    const moveUp = (idxrow, idxcol) => {
      let localRowPos = idxrow
      if (isFirstRow(idxrow)) {
        return
      }
      localRowPos -= 1
      moveTo(localRowPos, idxcol)
    }

    const moveTo = (idxrow, idxcol) => {
      const name = 'div' + Number(idxrow) + Number(idxcol)
      const element = document.getElementById(name)
      if (element) {
        element.focus()
      }
    }

    const selectedRowsIds = () => {
      return tmodels.selectedRowsIds || []
    }

    // GRID EVENTS

    const onKeyDown = (keycode) => {
      context.emit('onKeyDown',
        {
          key: keycode,
          rowPos: tmodels.currentRowPos,
          colPos: tmodels.currentColPos,
          isLastRow: isLastRow(tmodels.currentRowPos)
        })
    }

    return {
      tmodels,
      cpcolautonumber,
      formatFieldTemplate,
      inputChange,
      divKeyPress,
      divfocus,
      divid,
      selecteDivInc,
      onblur,
      moveLeft,
      moveRight,
      moveDown,
      moveUp,
      moveTo,
      selectedRowsIds,
      isCurrentInput,
      cellClick,
      onKeyDown
    }
  }
}
</script>

<style scoped>

.grid {
  background: #e8ebeb !important;
  border: none;
}

.gridcolumn {
  border: 1px solid lightgray;
  text-align: center;
  overflow: hidden;
  padding: 4px;
}

input {
  cursor: cell;
  height: 25px;
  border: 1px solid lightgray;
}

input.cell {
  left: 0;
  border: none;
  height: 20px;
}

.divautoinc {
  cursor: e-resize;
  border: 1px solid lightgray;
}

.divautoinc:hover {
  background: #cfd0d0;
  color: white
}

.divautoinc.selected {
  background: #d4f3f3;
  color: black;
}

.divip {
  position: absolute;
  top: 0px;
  cursor: cell;
  height: 25px;
  background: white;
  color: black;
  border: 1px solid lightgray;
  height: 25px;
  z-index: -1px;
}

.divip:hover {
  cursor: cell;
}

.divip:focus-within {
  border: 2px solid green;
  outline: none !important;
}

</style>
