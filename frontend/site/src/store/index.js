import Vue from 'vue'
import Vuex from 'vuex'

import { getMovieLists, getWatchList } from '@/services/home'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    homeLists: [],
    watchList: [],
    movies: [],
    user: null,
    availableUsers: [],
    inspectedMovie: null,
    searchInput: ''
  },
  getters: {
    loggedIn (state) {
      return !!state.user
    },
    moviesWithPosters (state) {
      return state.movies.filter(movie => !!movie.posterurl)
    },
    moviesWithoutPosters (state) {
      return state.movies.filter(movie => !movie.posterurl)
    },
    moviesByGenre: (state) => (genre) => {
      return state.movies.filter(movie => movie.genres && movie.genres.includes(genre))
    },
    searchInput: (state) => {
      return state.searchInput
    }
  },
  mutations: {
    setMovies (state, movies) {
      state.movies = movies
    },
    setAvailableUsers (state, users) {
      state.availableUsers = users
    },
    removeAvailableUserByEmail (state, email) {
      state.availableUsers = state.availableUsers.filter(user => user.email !== email)
    },
    loadAvailableUsers (state) {
      fetch('/api/users')
        .catch(err => { this.error = err })
        .then(data => data.json())
        .then(users => { state.availableUsers = users })
    },
    addMovie (state, movie) {
      state.movies = [...state.movies, movie]
    },
    logout (state) {
      fetch('/api/auth/logout', { method: 'POST' })
      state.homeLists = []
      state.watchList = []
      state.inspectedMovie = null
      state.searchInput = ''
      state.user = null
    },
    login (state, user) {
      state.user = user
    },
    openMovieModal (state, movie) {
      state.inspectedMovie = movie
    },
    closeMovieModal (state) {
      state.inspectedMovie = null
    },
    updateSearchInput (state, newVal) {
      state.searchInput = newVal
    },
    addHomeList (state, newList) {
      state.homeLists = [...state.homeLists, newList]
    },
    addHomeLists (state, newLists) {
      state.homeLists = [...state.homeLists, ...newLists]
    },
    async refreshGenreLists (state) {
      const genreLists = await getMovieLists()
      state.homeLists = [...genreLists]
    },
    async refreshWatchList (state) {
      state.watchList = await getWatchList()
    }
  },
  actions: {
    loadHome: function (context) {
      context.commit('refreshWatchList')
      context.commit('refreshGenreLists')
    }
  }
})

export default store
