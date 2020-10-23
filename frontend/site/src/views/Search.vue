<template>
  <div class="home">
    <movie-list title="Suchergebnisse" :movies=movies></movie-list>
  </div>
</template>

<script>
import MovieList from '@/components/MovieList'

export default {
  name: 'Search',
  components: {
    MovieList
  },
  data: function () {
    return {
      movies: [],
      timer: null
    }
  },
  computed: {
    searchInput: function () {
      return this.$store.state.searchInput
    }
  },
  mounted: function () {
    const { term } = this.$route.params
    fetch(`/api/search/${term}`).then(data => data.json()).then(movies => { this.movies = movies })
  },
  watch: {
    searchInput: async function () {
      const { term } = this.$route.params

      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(
        () => { fetch(`/api/search/${term}`).then(data => data.json()).then(movies => { this.movies = movies }) },
        200)
      return null
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit('updateSearchInput', '')
    next()
  }
}
</script>

<style lang="scss">
</style>
