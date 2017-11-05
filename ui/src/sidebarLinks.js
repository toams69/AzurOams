export default [
  // {
  //   name: 'Accueil',
  //   icon: 'ti-panel',
  //   path: '/azuroams'
  // },
  // {
  //   name: 'Centres de loisirs',
  //   icon: 'ti-panel',
  //   path: '/clsh'
  // },
  // {
  //   name: 'Activités',
  //   icon: 'ti-package',
  //   path: '/activites'
  // },
  {
    name: 'Membres',
    icon: 'ti-clipboard',
    path: '/membres'
  },
  {
    name: 'Administration',
    icon: 'ti-view-list-alt',
    collapsed: true,
    children: [{
      name: 'Factures',
      path: '/factures'
    }
    ]
  }
]
