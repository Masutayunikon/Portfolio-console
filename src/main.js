import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import ExperienceView from './views/ExperienceView.vue'
import ProjectsView from './views/ProjectsView.vue'
import ProjectDetailView from './views/ProjectDetailView.vue'
import SkillsView from './views/SkillsView.vue'
import ContactView from './views/ContactView.vue'
import PackageView from './views/PackageView.vue'
import StatsView from './views/StatsView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',              component: HomeView },
    { path: '/about',         component: AboutView },
    { path: '/experience',    component: ExperienceView },
    { path: '/projects',      component: ProjectsView },
    { path: '/projects/:repo', component: ProjectDetailView },
    { path: '/skills',        component: SkillsView },
    { path: '/contact',       component: ContactView },
    { path: '/stats',         component: StatsView },
    { path: '/package-json',  component: PackageView },
  ]
})

createApp(App).use(router).mount('#app')
