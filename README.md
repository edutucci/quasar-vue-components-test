# quasar-vue-excel-editor

### This project has been created to help the project [vue-excel-editor](https://github.com/cscan/vue-excel-editor) work in vue3.

******

### Bug fix: vue-excel-editor

| Name                  | Arguments | Description |
| :---                  | :---      | :---        |
| moveTo                | Method    | Not working when row number is not showing in grid. |

## Events List Added

### Event Component: vue-excel-editor

| Name                  | Arguments                   | Description |
| :---                  | :---                        | :---        |
| unSelect              | selectIdArray, direction    | Emit when rows are unselected |

## Events List Changed

### Event Component: vue-excel-editor

| Name                  | Arguments                   | Description |
| :---                  | :---                        | :---        |
| select                | selectIdArray, direction    | Emit when rows are selected |

## Behavior

### Event Component: vue-excel-editor

| Name                  | Arguments                   | Description |
| :---                  | :---                        | :---        |
| cell-click            | row selection               | Rows are unselected |
| update                | updateItemArray             | added $rowPos |

### Prop Component added: vue-excel-editor

| Name                  | Arguments       | Type      | Description |
| :---                  | :---            | :--       | :---        |
| multiUpdate           | updateItemArray | Boolean   | Update multiple cell information  |
| enterToNextRow        | Optional        | Boolean   | Go to next line when reach last column  |

## Getting started

In your template

```html
<template>
  <vue-excel-editor v-model="models.rows" ref="grid">
    <vue-excel-column field="user"   label="User" />
    <vue-excel-column field="name"   label="Name" />
    <vue-excel-column field="phone"  label="Contact" />
    <vue-excel-column field="gender" label="Gender" type="select" :options="['M', 'F']"/>
    <vue-excel-column field="age"    label="Age" />
    <vue-excel-column field="birth"  label="Date Of Birth" />
  </vue-excel-editor>
</template>
```

In your script
```js
import { ref, reactive } from 'vue'

export default {
  setup () {
    const grid = ref(null)
    const models = reactive({
      rows: [
        { id: 0, user: 'hc', name: 'Harry Cole', phone: '1-415-2345678', gender: 'M', age: 25, birth: '1997-07-01' },
        { id: 1, user: 'sm', name: 'Simon Minolta', phone: '1-123-7675682', gender: 'M', age: 20, birth: '1999-11-12' },
        { id: 2, user: 'ra', name: 'Raymond Atom', phone: '1-456-9981212', gender: 'M', age: 19, birth: '2000-06-11' },
        { id: 3, user: 'ag', name: 'Mary George', phone: '1-556-1245684', gender: 'F', age: 22, birth: '2002-08-01' },
        { id: 4, user: 'kl', name: 'Kenny Linus', phone: '1-891-2345685', gender: 'M', age: 29, birth: '1990-09-01' }
      ]
    })

    return {
      grid,
      models
    }
  }
}
</script>
```
