<template>
  <div>
    <nav class="navbar navbar-transparent navbar-absolute">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navigation-example-2"
                  @click="toggleNavbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" to="/">Azuroams V3</router-link>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav navbar-right">
          </ul>
        </div>
      </div>
    </nav>

    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page" data-color="azure"
           data-image="static/img/background/background-5.jpg">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
                <form method="#" action="#">
                  <div class="card" data-background="color" data-color="blue">
                    <div class="card-header">
                      <h3 class="card-title">Login</h3>
                    </div>
                    <div class="card-content">
                      <div class="form-group">
                        <label>Nom d'utilisateur</label>
                        <input type="text" placeholder="Entrer nom d'utilisateur" v-model="username" class="form-control input-no-border">
                      </div>
                      <div class="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="Password" v-model="password" class="form-control input-no-border">
                      </div>
                    </div>
                    <div class="card-footer text-center">
                      <button v-on:click="login" class="btn btn-fill btn-wd ">Let's go</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <footer class="footer footer-transparent">
          <div class="container">
            <div class="copyright">
              &copy; Coded with
              <i class="fa fa-heart heart"></i> by
              <a href="https://github.com/cristijora" target="_blank">Thomas Pariaud</a>.
            </div>
          </div>
        </footer>
        <div class="full-page-background" style="background-image: url(static/img/background/background-5.jpg) "></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      toggleNavbar () {
        document.body.classList.toggle('nav-open')
      },
      closeMenu () {
        document.body.classList.remove('nav-open')
        document.body.classList.remove('off-canvas-sidebar')
      },
      login () {
        this.$store.dispatch('login', {username: this.username, password: this.password})
      }
    },
    mounted () {
      this.$store.watch(
        function (state) {
          return state.auth.isAuthenticated
        },
        (newValue) => {
          if (newValue) {
            this.$router.push('/')
          }
        },
        {
          deep: true
        }
      )
    },
    beforeDestroy () {
      this.closeMenu()
    }
  }
</script>
<style>
</style>
