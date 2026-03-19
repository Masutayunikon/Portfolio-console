---
title: Vue 3 Composition API — ce que j'utilise vraiment
date: 2024-03-15
description: Les patterns de la Composition API que j'applique au quotidien
tags: [vue, javascript, frontend]
---

# Vue 3 Composition API — ce que j'utilise vraiment

La Composition API de Vue 3 a changé ma façon d'écrire des composants. Voici les patterns que j'utilise vraiment en production.

## Composables partagés au niveau module

Au lieu de créer un state local dans chaque composable, je mets les refs **en dehors** de la fonction exportée. Résultat : tout le monde partage le même état.

```js
// ✅ État partagé entre tous les composants
const repos   = ref([])
const loading = ref(false)

export function useGitHub() {
  // repos et loading sont partagés
  return { repos, loading, fetchRepos }
}
```

```js
// ❌ État local — recréé à chaque appel
export function useGitHub() {
  const repos   = ref([])  // nouvelle instance à chaque fois
  const loading = ref(false)
  return { repos, loading, fetchRepos }
}
```

## `watch` vs `watchEffect`

J'utilise `watch` quand je connais exactement ce que je surveille, `watchEffect` pour les dépendances dynamiques.

```js
// watch — explicite, bien pour les routes
watch(() => route.params.id, (newId) => {
  fetchProject(newId)
}, { immediate: true })

// watchEffect — pratique pour plusieurs dépendances
watchEffect(() => {
  document.title = `${currentFile.value} — Portfolio`
})
```

## `computed` pour les transformations

Les computed sont mes meilleurs amis pour éviter les re-renders inutiles.

```js
const sortedRepos = computed(() =>
  [...repos.value].sort((a, b) => b.stargazers_count - a.stargazers_count)
)

const langStats = computed(() => {
  const counts = {}
  repos.value.forEach(r => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
  })
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
})
```

## Conclusion

La Composition API rend le code plus prévisible et réutilisable. La courbe d'apprentissage vaut vraiment le coup.
