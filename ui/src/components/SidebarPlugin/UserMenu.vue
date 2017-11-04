<template>
  <div class="user">
    <div class="photo">
      <img :src="'static/img/faces/' + user['LOGIN_PERSONNEL'].toLowerCase() + '.jpg'"/>
    </div>
    <div class="info">
      <a data-toggle="collapse" @click="toggleMenu" href="javascript:void(0)">
           <span>
             {{user['NOM_PERSONNEL']}} {{user['PRENOM_PERSONNEL']}}
             <!-- <b class="caret"></b> -->
          </span>
      </a>
      <div class="clearfix"></div>
      <div>
        <el-collapse-transition>
          <!-- <ul class="nav" v-show="!isClosed">
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">Mp</span>
                <span class="sidebar-normal">My Profile</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">Ep</span>
                <span class="sidebar-normal">Edit Profile</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)">
                <span class="sidebar-mini">S</span>
                <span class="sidebar-normal">Settings</span>
              </a>
            </li>
          </ul> -->
        </el-collapse-transition>
      </div>
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
      user: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        isClosed: true
      }
    },
    methods: {
      toggleMenu () {
        this.isClosed = !this.isClosed
      }
    }
  }
</script>
<style>
  .collapsed {
    transition: opacity 1s;
  }
</style>
