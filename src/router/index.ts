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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
