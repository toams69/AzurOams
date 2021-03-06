<template>
  <div :class="sidebarClasses" :data-background-color="backgroundColor" :data-active-color="activeColor">
    <!--
            Tip 1: you can change the color of the sidebar's background using: data-background-color="white | black | darkblue"
            Tip 2: you can change the color of the active button using the data-active-color="primary | info | success | warning | danger"
        -->
    <!-- -->
    <div class="logo">
      <a class="simple-text logo-mini" href="/">
          <div class="logo-img">
              <img :src="logo" alt="">
          </div>
      </a>

      <a class="simple-text logo-normal" href="/">
          {{ title }}
      </a>
    </div>
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <slot>

      </slot>
      <ul :class="navClasses" >
        <li v-for="(link, index) in sidebarLinks"
            :class="{active: isMenuActive(link) || link.active}">
          <a v-if="link.children" data-toggle="collapse" href="javascript:void(0)"
             @click="collapseMenu(index)">
            <i :class="link.icon"></i>
            <p>{{link.name}}
              <b class="caret"></b>
            </p>
          </a>

            <div v-if="link.children"
                 aria-expanded="true">
              <el-collapse-transition>
                <ul class="nav" v-show="!link.collapsed">
                  <component v-for="(subLink, subLinkIndex) in link.children"
                               :is="elementType(subLink)"
                               :key="subLink.path"
                               :to="subLink.path" tag="li"
                               :class="{active: subLink.active}"
                               :ref="subLink.name">
                    <a :title='subLink.path' :href="elementType(subLink) === 'li' ? subLink.path : '#'" :target="subLink.target">
                      <span class="sidebar-mini">{{linkAbbreviation(subLink.name)}}</span>
                      <span class="sidebar-normal">{{subLink.name}}</span>
                    </a>
                  </component>
                </ul>
              </el-collapse-transition>
            </div>


          <component v-else
                     :to="link.path"
                     :is="elementType(link, false)"
                     :class="{active: link.active}"
                     :target="link.target"
                     :href="link.path">
            <i :class="link.icon"></i>
            <p>{{link.name}}</p>
          </component>

        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
  export default {
    components: {
      [CollapseTransition.name]: CollapseTransition
    },
    props: {
      title: {
        type: String,
        default: 'AzurOams'
      },
      type: {
        type: String,
        default: 'sidebar',
        validator: (value) => {
          let acceptedValues = ['sidebar', 'navbar']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      backgroundColor: {
        type: String,
        default: 'black',
        validator: (value) => {
          let acceptedValues = ['white', 'brown', 'black']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      activeColor: {
        type: String,
        default: 'info',
        validator: (value) => {
          let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      logo: {
        type: String,
        default: 'static/img/vue-logo.png'
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      sidebarClasses () {
        if (this.type === 'sidebar') {
          return 'sidebar'
        } else {
          return 'collapse navbar-collapse off-canvas-sidebar'
        }
      },
      navClasses () {
        if (this.type === 'sidebar') {
          return 'nav'
        } else {
          return 'nav navbar-nav'
        }
      },
      /**
       * Styles to animate the arrow near the current active sidebar link
       * @returns {{transform: string}}
       */
      arrowMovePx () {
        return this.linkHeight * this.linkCountFromTop + 5 * this.menuCountFromTop
      }
    },
    data () {
      return {
        linkHeight: 52,
        linkCountFromTop: 0,
        menuCountFromTop: 0,
        windowWidth: 0,
        isWindows: false,
        hasAutoHeight: false,
        currentActiveMenu: {}
      }
    },
    methods: {
      findActiveLink () {
        if (!this.$route) return
        this.linkCountFromTop = 0
        this.menuCountFromTop = 0
        this.sidebarLinks.every((menu) => {
          let hasChildren = menu.children
          let isActive = this.isMenuActive(menu)
          if (!isActive) {
            this.linkCountFromTop = hasChildren ? this.linkCountFromTop + 1 : this.linkCountFromTop
            this.menuCountFromTop = hasChildren ? this.menuCountFromTop + 1 : this.menuCountFromTop
            if (hasChildren && !menu.collapsed) {
              this.linkCountFromTop += menu.children.length
            }
          } else {
            if (hasChildren && !menu.collapsed) {
              this.menuCountFromTop++
              menu.children.every((subMenu) => {
                let isActive = subMenu.path === this.$route.path
                this.linkCountFromTop++
                return !isActive
              })
            }
          }
          return !isActive
        })
      },
      isMenuActive (menu) {
        if (!this.$route) return false
        if (menu.path === this.$route.path) {
          this.currentActiveMenu = menu
          return true
        }
        if (menu.children) {
          let child = menu.children.find(child => child.path === this.$route.path)
          if (child) {
            this.currentActiveMenu = menu
            return true
          }
        }
        return false
      },
      elementType (link, isParent = true) {
        if (link.isRoute === false) {
          return isParent ? 'li' : 'a'
        } else {
          return 'router-link'
        }
      },
      collapseMenu (index) {
        let link = this.sidebarLinks[index]
        link.collapsed = !link.collapsed
        this.findActiveLink()
      },
      linkAbbreviation (name) {
        const matches = name.match(/\b(\w)/g)
        return matches.join('')
      },
      async initScrollBarAsync () {
        await import('perfect-scrollbar/dist/css/perfect-scrollbar.css')
        const PerfectScroll = await import('perfect-scrollbar')
        PerfectScroll.initialize(this.$refs.sidebarScrollArea)
      }
    },
    mounted () {
      this.findActiveLink()
      if (this.currentActiveMenu && this.currentActiveMenu.collapsed) {
        this.currentActiveMenu.collapsed = false
      }
      this.initScrollBarAsync()
    },
    beforeDestroy () {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false
      }
    },
    watch: {
      $route: function (newRoute, oldRoute) {
        this.findActiveLink()
      }
    }
  }
</script>
<style>
  @media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu{
      display: none;
    }
  }
</style>
