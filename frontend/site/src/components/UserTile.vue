<template>
  <div class="user-tile user-tile-hoverable"
     v-bind:title=user.name v-on:click="loginUser">
    <div class="user-tile-box">
      <img class="delete-user-button" v-on:click.stop="deleteUser" v-if=editMode
        src="../assets/minus-circle-solid.svg">
    </div>
    <h4 class="user-tile-name">{{user.name}}</h4>
  </div>
</template>

<script>
export default {
  name: 'UserTile',
  props: {
    user: Object,
    editMode: Boolean
  },
  methods: {
    loginUser () {
      const defaultPassword = 'password123'
      const email = `${this.user.name}@test.com`
      fetch('/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: defaultPassword
          })
        })
        .catch(err => alert(err))
        .then(res => {
          const user = res.json()
          this.$store.commit('login', user)
          this.$router.push(this.$route.query.redirect || '/')
        })
    },
    async deleteUser () {
      try {
        fetch(`/api/users/${this.user.email}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw Error('Could not delete user!')
          })
        this.$store.commit('removeAvailableUserByEmail', this.user.email)
      } catch (err) {
        alert('Could not delete user!')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.user-tile {
  display: flex;
  flex-wrap: none;
  flex-direction: column;
  align-items: center;
  flex: 1 1 auto;
}

.user-tile-name {
  color: rgb(177, 177, 177);
  font-size: 2rem;
}

.user-tile-box {
  width: 10vw;
  height: 10vw;
  margin: 1vh 1.5vw;
  background-image: url("../assets/user-solid.svg");
  background-size: 60%;
  background-color: red;
  background-repeat: no-repeat;
  background-position: center;
  border: rgb(47, 47, 47) solid 3px;
  border-radius: 2px;
  position: relative;
}

.user-tile-hoverable:hover {
  cursor: pointer;
  .user-tile-box {
    border-color: white;
  }
  .user-tile-name {
    color: white;
  }
}

@media only screen and (max-width: 540px) {
  .user-tile-box {
    width: 50vw;
    height: 50vw;
  }

  .user-tile-input {
    width: 50vw;
  }

  .user-selection-header {
    margin: 3rem 0rem;
  }
}

</style>
