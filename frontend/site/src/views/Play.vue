<template>
  <div class="player-container">
    <player :sources="videoSources" :name="this.$route.params.name"></player>
  </div>
</template>

<script>
import Player from '@/components/Player'

export default {
  name: 'Play',
  components: {
    Player
  },
  computed: {
    videoSources: function () {
      const { name } = this.$route.params
      const sources = [
        {
          src: `/api/static/${name}.mp4`,
          type: 'video/mp4'
        }
      ]
      return sources
    }
  }

}
</script>

<style lang="scss" scoped>

.player-container {
  width: 80%;
  position: relative;
  margin: auto;
}

</style>
