<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item v-for="(menuItem, index) in models.menuList" :key="index"
          clickable v-ripple :to="menuItem.path"
        >
          <q-item-section>
            {{ menuItem.label }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    const models = reactive({
      menuList: [
        {
          id: 'tuccigrid',
          icon: '',
          label: 'VueEdtGrid',
          visible: true,
          path: '/vueedtgrid',
          beta: true
        },
        {
          id: 'vueexceleditor',
          icon: '',
          label: 'Vue Excel Editor',
          visible: false,
          path: '/vueexcel',
          beta: true
        },
        {
          id: 'revogrid',
          icon: '',
          label: 'Revo Grid Stencil',
          visible: true,
          path: '/revogrid',
          beta: true
        },
        {
          id: 'revogrid',
          icon: '',
          label: 'Revo Grid Vue',
          visible: true,
          path: '/revogridvue',
          beta: true
        }
      ]
    })

    const leftDrawerOpen = ref(false)

    return {
      models,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
