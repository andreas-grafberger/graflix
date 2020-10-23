<template>
   <div class="list-row">
    <h2 class="list-row-title">{{ title }}</h2>
    <div class="list-row-container" id="movie-tile-container" v-if="movies.length">
      <transition-group name="list" @before-leave="beforeLeave">
        <div v-for="movie in movies" :key="movie.id">
          <movie-tile v-bind=movie></movie-tile>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import MovieTile from '@/components/MovieTile'
export default {
  name: 'MovieList',
  components: {
    MovieTile
  },
  props: {
    title: String,
    movies: Array
  },
  methods: {
    beforeLeave (el) {
      // Necessary for animation because position: absolute moves everything to the top left
      const { marginLeft, marginTop, width, height } = window.getComputedStyle(el)

      el.style.left = `${el.offsetLeft - parseFloat(marginLeft, 10)}px`
      el.style.top = `${el.offsetTop - parseFloat(marginTop, 10)}px`
      el.style.width = width
      el.style.height = height
    }
  }
}
</script>
<style lang="scss" scoped>
.list-row {
  min-height: 20vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.list-row h2 {
  color: rgba(255, 255, 255, 0.95);
  font-size: 3rem;
  margin-bottom: 1rem;
}

.movie-tile {
  margin-right: 2rem;
  margin-bottom: 2rem;
}

.list-row-container > * {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.list-item {
  position: absolute;
}
.list-leave-active {
  //transition: translateY(30px) 1s;
  position: absolute;
}

.list-enter-active {
  transition: all 1s;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  //transform: translateY(15px);
}

.list-move {
  transition: all 1s;
}

@media only screen and (max-width: 540px) {
  .list-row {
    align-items: center;
  }

  .list-row-container {
    flex-direction: column;
  }

  .movie-tile {
    margin-right: 0;
  }
}
</style>
