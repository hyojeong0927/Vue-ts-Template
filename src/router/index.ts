import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/layouts/Layout.vue'

// publish status
import PublishStatus from '@/reference/work/PublishStatus.vue'
// guide
import Rule from '@/reference/guide/Rule.vue'
import Term from '@/reference/guide/Term.vue'
// example
import AgreeFormExample from '@/reference/example/AgreeFormExample.vue'
import ButtonExample from '@/reference/example/ButtonExample.vue'
import CheckboxExample from '@/reference/example/CheckboxExample.vue'
import DatePickerExample from '@/reference/example/DatePickerExample.vue'
import EtcExample from '@/reference/example/EtcExample.vue'
import FloatingBarExample from '@/reference/example/FloatingBarExample.vue'
import FormExample from '@/reference/example/FormExample.vue'
import ModalExample from '@/reference/example/ModalExample.vue'
import SelectboxExample from '@/reference/example/SelectboxExample.vue'
import StepExample from '@/reference/example/StepExample.vue'
import TabsExample from '@/reference/example/TabsExample.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'PublishStatus', component: PublishStatus },
      // guide
      { path: 'guide/rule', name: 'Rule', component: Rule },
      { path: 'guide/term', name: 'Term', component: Term },
      // example
      { path: 'example/agree', name: 'AgreeFormExample', component: AgreeFormExample },
      { path: 'example/button', name: 'ButtonExample', component: ButtonExample },
      { path: 'example/checkbox', name: 'CheckboxExample', component: CheckboxExample },
      { path: 'example/datepicker', name: 'DatePickerExample', component: DatePickerExample },
      { path: 'example/etc', name: 'EtcExample', component: EtcExample },
      { path: 'example/floatingbar', name: 'FloatingBarExample', component: FloatingBarExample },
      { path: 'example/form', name: 'FormExample', component: FormExample },
      { path: 'example/modal', name: 'ModalExample', component: ModalExample },
      { path: 'example/selectbox', name: 'SelectboxExample', component: SelectboxExample },
      { path: 'example/step', name: 'StepExample', component: StepExample },
      { path: 'example/tab', name: 'TabsExample', component: TabsExample },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
