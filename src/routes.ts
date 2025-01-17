import LandingPage from '@/pages/landing-page/LandingPage.vue'
import RoomSettingsPage from '@/pages/room-settings/RoomSettingsPage.vue'
import RoomsPage from '@/pages/rooms/RoomsPage.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
const routes = [
  {
    path: '/rooms',
    component: RoomsPage,
  },
  {
    path: '/room-settings',
    component: RoomSettingsPage,
  },
  {
    path: '/',
    component: LandingPage,
  },
]

export default createRouter({
  history: createMemoryHistory(),
  routes,
})
