import { boot } from 'quasar/wrappers'
import VueExcelColumn from '../components/VueExcelEditor/VueExcelColumn'

export default boot(({ app }) => {
  app.component('VueExcelColumn', VueExcelColumn)
})
