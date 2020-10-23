<template>
  <video id="player" playsinline controls data-poster="/path/to/poster.jpg">
    <source :src="source.src" :type="source.type"  :key="source.src" v-for="source in sources"/>
  </video>
</template>

<script>
import Plyr from 'plyr'
import '@/assets/css/plyr.css'

export default {
  name: 'Player',
  props: {
    name: String,
    sources: Array
  },
  methods: {
    updateSecondsWatched: function () {
      this.lastTimeUpdated = new Date().getTime() / 1000
      fetch(`/api/movies/watched/${this.name}?seconds=${Math.round(this.player.currentTime)}`,
        { method: 'PUT' }
      )
    },
    shouldUpdateSecondsWatched: function () {
      const currentSeconds = new Date().getTime() / 1000
      return this.triedSettingLastTimeWatched && (currentSeconds - this.lastTimeUpdated) > 10
    },
    getSecondsWatched: async function () {
      return await fetch(`/api/movies/watched/${this.name}`).then(data => data.json()).then(info => info.seconds_watched)
    }
  },
  data: function () {
    return {
      controls: [
        'play-large', // The large play button in the center
        // 'restart', // Restart playback
        'rewind', // Rewind by the seek time (default 10 seconds)
        'play', // Play/pause playback
        'fast-forward', // Fast forward by the seek time (default 10 seconds)
        'progress', // The progress bar and scrubber for playback and buffering
        'current-time', // The current time of playback
        'duration', // The full duration of the media
        'mute', // Toggle mute
        'volume', // Volume control
        // 'captions', // Toggle captions
        'settings', // Settings menu
        'pip', // Picture-in-picture (currently Safari only)
        'airplay', // Airplay (currently Safari only)
        'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
        'fullscreen' // Toggle fullscreen
      ],
      lastTimeUpdated: 0,
      player: null,
      triedSettingLastTimeWatched: false
    }
  },
  mounted: async function () {
    const player = new Plyr('#player', {
      controls: this.controls,
      autoplay: true
    })
    this.player = player
    player.on('timeupdate', event => {
      if (this.shouldUpdateSecondsWatched()) {
        this.updateSecondsWatched()
      }
    })
    player.on('canplay', async event => {
      if (this.triedSettingLastTimeWatched) return

      this.triedSettingLastTimeWatched = true
      const seconds = await this.getSecondsWatched()
      if (seconds) {
        player.currentTime = seconds
      }
    })
  }
}
</script>
<style lang="scss">
  #app {
    --plyr-color-main: #e50914;
    --plyr-font-family: Montserrat, sans-serif;
  }
</style>
<style lang="scss" scoped>
#app .plyr {
    --plyr-color-main: #1ac266;
}
</style>
