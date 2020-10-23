<template>
  <div id="app">
    <div id="nav">
      <router-link to="/"><h1 id="logo">Graflix</h1></router-link>
      <router-link to="/" v-if="this.$store.getters.loggedIn">Home</router-link>
      <router-link to="/all" v-if="this.$store.getters.loggedIn">Alle Filme</router-link>
      <input class="search-input"
      placeholder="Suche..."
      v-if="this.$store.getters.loggedIn"
      :value="this.$store.getters.searchInput"
      v-on:input="updateSearchInput">
      <button id="logout" v-show="this.$store.getters.loggedIn" v-on:click.stop="logout">Logout</button>
    </div>
    <div class="main">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
    <transition name="modal-fade">
      <movie-modal v-if="this.$store.state.inspectedMovie" v-bind="this.$store.state.inspectedMovie"></movie-modal>
    </transition>
  </div>
</template>
<script>
import MovieModal from '@/components/MovieModal'

export default {
  name: 'App',
  methods: {
    logout () {
      this.$router.push({ name: 'Login' })
      this.$store.commit('logout')
    },
    updateSearchInput (e) {
      this.$store.commit('updateSearchInput', e.target.value)
      if (e.target.value !== '') {
        if (this.$route.name === 'Search') {
          this.$router.replace({ path: `/search/${e.target.value}` })
        } else {
          this.$router.push({ path: `/search/${e.target.value}` })
        }
      } else {
        this.$router.go(-1)
        e.target.blur()
      }
    }
  },
  components: {
    MovieModal
  },
  watch: {
    '$route' (to, from) {
      document.title = to.name ? 'Graflix - ' + to.name : 'Graflix'
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC&family=Montserrat:wght@100;400&family=Source+Sans+Pro:ital,wght@0,200;1,200&display=swap');
//:root {
//  --plyr-color-main: #1ac266;
//  --plyr-font-family: Montserat, sans-serif;
//}
// Resets
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  font-size: 62.5%;
  //font-family: "Montserrat", sans-serif;
}
a {
  text-decoration: none;
}

// Global variables
$background-color: #141414;
$primary-color: #e50914;

h1,
h2,
h3,
h4,
p,
button,
label,
a,
input {
  font-family: "Montserrat", sans-serif;
  color: white;
}

#app {
  background-color: $background-color;
  margin: auto;
  min-height: 100vh;

  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}

#nav {
  background: linear-gradient(rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  min-height: 10vh;
  align-items: center;
  color: white;
  position: sticky;
  padding: 1rem 4rem 1rem 4rem;
  flex-wrap: wrap;

  li {
    :hover {
      font-size: 3rem;
    }
  }

  a {
    font-size: 1.5rem;
    margin: 1rem 1rem;

    &.router-link-exact-active {
      font-size: 1.7rem;
    }

    &:hover:not(.router-link-exact-active) {
      font-size: 1.6rem;
      transition: 0.2s ease-out;
    }
  }

  #logout {
    margin-left: auto;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
}

.main {
  padding: 1rem 4rem 1rem 4rem;
}

#logo {
  font-family: "Amatic SC", cursive;
  font-size: 4rem;
  font-weight: 800;
  color: $primary-color;
  flex: 1 1 20rem;
  margin-right: 2rem;
}

.search-input {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  margin: auto;
  padding: 0.5rem 2rem;
  outline-color: transparent;
  outline-style: none;

  border: 1px solid rgba(white, 0.2);
  border-radius: 30px;

  &:focus {
    border: 1px solid #eee;
    padding: 1rem 2rem;
    transition: padding 0.1s ease-in, border 0.8s ease-in, border-radius 0.2s ease-in;
    border-radius: 0px;
  }
}

.modal-fade-enter-active, .modal-fade-leave-active {
    transition: all 150ms cubic-bezier(0.250, 0.250, 0.750, 0.750);
  }
  .modal-fade-enter, .modal-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transform: scale(1.2);
    opacity: 0;
  }

</style>
