<template>
  <div
    :class="`movie-tile ${posterurl || 'no-poster'}`"
    v-on:click="openModal"
  >
    <div class="details">
      <h3>{{name}}</h3>
      <h4>{{year}}</h4>
    </div>
    <img v-if="!!posterurl" :src="posterurl" class="poster">
  </div>
</template>

<script>

export default {
  name: 'MovieTile',
  props: {
    id: Number,
    name: String,
    posterurl: String,
    year: Number,
    description: String,
    genres: Array,
    length: Number
  },
  methods: {
    openModal: function () {
      this.$store.commit('openMovieModal', this.$props)
    }
  }
}
</script>

<style scoped lang="scss">

.no-poster {
  background-image: linear-gradient(326deg, black 0%, #861657 90%);

  &:hover {
    background-image: linear-gradient(326deg, rgba(black, 0.6) 0%, rgba(#861657, 0.6) 90%);
  }
}

.movie-tile {
  display: flex;
  flex: 1 0 auto;
  position: relative;
  height: 15rem;
  width: 25rem;
  box-shadow: 0.1rem 0.1rem 2rem black;
  overflow: hidden;

  .details {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  h3 {
    color: white;
    font-size: 2rem;
  }

  h4 {
    opacity: 0%;
    font-size: 1.5rem;
    color: #cccccc;
    font-weight: 800;
  }

  .poster {
    height: 100%;
    width: 100%;
    opacity: 0.9;
    object-fit: cover;
    position: absolute;
  }

  &:hover {
    cursor: pointer;

    transition: 0.3s ease-in-out;
    z-index: 2;
    box-shadow: 0.1rem 0.1rem 4rem black;

    h3 {
      font-size: 2.1rem;
      text-shadow: 0.4rem 0.4rem 0.4rem black;
      transition: 0.5s;
    }

    h4 {
      opacity: 100%;
      transition: 0.8s;
    }

    .poster {
      opacity: 0.2;
    }
  }
}

</style>
