<template>
  <div>
    <div class="user-selection-container">
      <h1 class="user-selection-header" v-bind:title="greeting">
        {{ greeting }}
      </h1>
      <h1 class="user-selection-header" v-if=error>
        {{error}}
      </h1>
      <div class="user-tiles-container">
        <template v-for="user in users" >
          <user-tile
            :id="user.email"
            :editMode="isInEditMode"
            :key="user.name"
            :user="user">
          </user-tile>
        </template>
      </div>
      <!--
        <button id="edit-users-button" v-on:click="editMode = !editMode"> {{ editUsersButtonTitle }}</button>
      -->
    </div>
  </div>

</template>

<script>
import UserTile from '@/components/UserTile'

export default {
  name: 'Login',
  components: {
    UserTile
  },
  data: function () {
    return {
      error: null,
      greeting: 'Wer schaut gerade?',
      editMode: false,
      isCreatingUser: false,
      userToBeLoggedIn: null
    }
  },
  computed: {
    editUsersButtonTitle: function () {
      return this.isInEditMode ? "I'm ready!" : 'Edit Users'
    },
    isInEditMode: function () {
      return this.editMode || this.users.length === 0
    },
    users: function () {
      return this.$store.state.availableUsers
    }
  },
  methods: {
    fetchUsers () {
      this.$store.commit('loadAvailableUsers')
    }
  },
  mounted: function () {
    this.fetchUsers()
  }
}
</script>

<style lang="scss">
.user-selection-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.user-selection-header {
  color: rgb(221, 221, 221);
  font-size: 4rem;
  margin: 5rem 0rem;
  text-align: center;
}

.user-tiles-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.delete-user-button {
  position: absolute;
  right: 0px;
  top: 0px;
  width: 20%;
  transform: translate(50%, -50%);
  //border: solid rgb(47, 47, 47) 2px;
  background-color: red;
  border-radius: 50%;
}

#edit-users-button {
  margin-top: 3rem;
  padding: 1rem 3rem;
  border: solid rgb(47, 47, 47) 2px;
  background-color: rgb(25, 25, 25);
}

#edit-users-button:hover,
#edit-users-button:active {
  margin-top: 3rem;
  padding: 1rem 3rem;
  border-color: white;
  cursor: pointer;
}

@media only screen and (max-width: 800px) {
  .user-selection-container {
    justify-content: flex-start;
  }
  .user-selection-header {
    font-size: 3rem;
  }
  .user-tile-input {
    width: 20vw;
  }
  .user-tile-box {
    width: 20vw;
    height: 20vw;
  }
}

</style>
