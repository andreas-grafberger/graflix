<template>
<div class="modal-backdrop" v-on:click.stop="close">
  <div class="modal" v-on:click.stop="">
    <svg id="close-button" v-on:click.stop="close" aria-hidden="true" focusable="false" data-prefix="far" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"></path>
    </svg>
    <div class="header">
      <div class="poster-container">
        <img :src="posterurl" v-if="posterurl"/>
        <div class="no-poster" v-else></div>
        <svg v-on:click="play" focusable="false" data-prefix="far" viewBox="0 0 512 512" id="play-icon">
          <path fill="currentColor" d="M371.7 238l-176-107c-15.8-8.8-35.7 2.5-35.7 21v208c0 18.4 19.8 29.8 35.7 21l176-101c16.4-9.1 16.4-32.8 0-42zM504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256z" class="">
            </path>
        </svg>
      </div>
      <div class="main-info-container">
        <h1>{{ name }}</h1>
        <h2>{{ year }}</h2>
        <h3 v-if="length">Länge: {{formattedLength}}</h3>
        <div class="genre-container">
          <button class="genre" v-for="genre in genres" :key=genre v-on:click="searchGenre(genre)"> {{ genre }} </button>
          <button id="watchlistButton" v-on:click.stop="toggleWatchList">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 512 512">
              <path v-if="!this.added" fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path>
              <path v-else fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
            </svg>
          </button>
        </div>
        <p class="description"> {{ description }}</p>
      </div>
    </div>
  </div>
</div>

</template>
<script>
export default {
  name: 'MovieModal',
  props:
  {
    id: Number,
    name: String,
    posterurl: String,
    year: Number,
    description: String,
    genres: Array,
    length: Number
  },
  methods: {
    close () {
      this.$store.commit('closeMovieModal')
    },
    play () {
      this.close()
      this.$router.push(`/play/${this.name}`)
    },
    searchGenre (genre) {
      this.close()
      this.$router.push(`/search/${genre}`)
    },
    refreshWatchInfo () {
      fetch(`/api/movies/watched/${this.name}`)
        .then(data => data.json())
        .then(({ added }) => {
          this.added = added
        })
    },
    async toggleWatchList () {
      if (!this.added) {
        await fetch(`/api/movies/watchlist/${this.id}`, { method: 'POST' })
      } else {
        await fetch(`/api/movies/watchlist/${this.id}`, { method: 'DELETE' })
      }

      this.refreshWatchInfo()
      this.$store.commit('refreshWatchList')
    }
  },
  mounted: function () {
    this.refreshWatchInfo()
  },
  computed: {
    formattedLength: function () {
      const hours = Math.floor(this.length / 3600)
      const minutes = Math.floor((this.length % 3600) / 60)
      const seconds = Math.floor((this.length % 60))
      return `${hours ? hours + ' Stunden' : ''} ${minutes ? minutes + ' Minuten' : ''} ${!hours && !minutes && seconds ? seconds + ' Sekunden' : ''}`
    }
  },
  data: function () {
    return {
      showMe: this.show,
      added: false
    }
  }
}
</script>

<style lang="scss" scoped>

$modal-background-color: #121212;

.modal-backdrop {
  //display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 2; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  //overflow: auto; /* Enable scroll if needed */
  background-color: rgba(0,0,0,0.5); /* Fallback color */
}

.no-poster {
  width: 100%;
  height: 40vh;
  background-color: #a4508b;
  background-image: linear-gradient(326deg, #a4508b 0%, #5f0a87 74%);
  mask-image: linear-gradient(to top, rgba($modal-background-color, 0) 0%, rgba($modal-background-color, 1) 100%);
}

.header {
  padding-bottom: 2rem;
  .main-info-container {
    margin-top: -10rem;
    margin-left: 5rem;
    margin-right: 5rem;

    h1 {
      font-size: 4rem;
    }
    h2 {
      font-size: 2.5rem;
    }
    h3 {
      font-size: 2rem;
      color: #ddd;
    }
  }

  img {
    width: 100%;
    max-height: 40vh;
    object-fit: cover;
    mask-image: linear-gradient(to top, rgba($modal-background-color, 0) 0%, rgba($modal-background-color, 1) 100%);
  }
}

.poster-container {
  width: 100%;
  position: relative;

  #play-icon {
    cursor: pointer;
    color: #bbb;
    width: 100px;
    height: 100px;
    position: absolute;
    margin: auto;
    top: 50%;
    left: 50%;
    margin-top: -50px;
    margin-left: -50px;

    &:hover {
      color: #fff;
    }
  }
}

.modal {
  margin-top: 5vh;
  border: 1px solid $modal-background-color;
  border-radius: 15px;
  position: fixed; /* Stay in place */
  z-index: 3; /* Sit on top */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px; /* Full width */
  max-height: 80vh;
  overflow: auto; /* Enable scroll if needed */
  background-color: $modal-background-color; /* Fallback color */

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.genre-container {

  display: flex;
  flex-direction: row;
  width: 100%;

  margin: 2rem 0rem 0rem 0rem;

  .genre:not(:last-child) {
    margin-right: 1rem;
  }
}

.genre {
  font-size: 1.5rem;
  border: 2px solid #777;
  padding: 0.5rem;
  border-radius: 35px;
  background: none;
  cursor: pointer;

  &:hover {
    border: 2px solid #ccc;
  }
}

.description {
  margin-top: 2rem;
  font-size: 1.6rem;
  color: #eee;
  font-weight: 400;
  margin-bottom: 0px;
}

#close-button {
    cursor: pointer;
    color: #bbb;
    z-index: inherit;
    padding: 1rem;
    width: 50px;
    height: 50px;
    position: absolute;
    margin: auto;
    top: 0%;
    left: 100%;
    margin-top: 0px;
    margin-left: -50px;

    &:focus, &:hover {
      color: white;
    }
}

#watchlistButton {
  width: 4rem;
  height: 4rem;
  cursor: pointer;
  background: none;
  border: none;
}

@media only screen and (max-width: 540px) {
  .modal {
    max-width: 90vw; /* Full width */
  }

  .poster-container #play-icon {
    width: 50px;
    height: 50px;
    margin-top: -25px;
    margin-left: -25px;
  }

  .header .main-info-container {
    margin-top: -5rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}

</style>
