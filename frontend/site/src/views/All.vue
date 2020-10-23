<template>
  <div class="home">
    <movie-list title="Alle Filme" :movies=movies></movie-list>
  </div>
</template>

<script>
import MovieList from '@/components/MovieList'

export default {
  name: 'All',
  components: {
    MovieList
  },
  data: function () {
    return {
      movies: this.$store.state.movies
    }
  }
}
</script>

<style lang="scss">
</style>
