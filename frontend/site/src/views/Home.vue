<template>
  <div class="home">
    <movie-list v-if="this.$store.state.watchList" v-bind="this.$store.state.watchList"></movie-list>
    <movie-list :title=list.title :movies=list.movies v-for="list of this.$store.state.homeLists" :key=list.title></movie-list>
  </div>
</template>

<script>
import MovieList from '@/components/MovieList'

export default {
  name: 'Home',
  components: {
    MovieList
  },
  mounted: async function () {
    this.$store.dispatch('loadHome')
  }
}
</script>

<style lang="scss">

@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
}

</style>
