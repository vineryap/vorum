<template>
  <div
    v-click-outside="closeMobileNavMenu"
    v-page-scroll="closeMobileNavMenu"
    class="z-10"
  >
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <router-link
              :to="{ name: 'Home' }"
              class="flex-shrink-0 text-gray-800 font-semibold font-heading text-2xl"
              >VORUM</router-link
            >
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <router-link
                  :to="{ name: 'Home' }"
                  class="inline-flex items-center space-x-1 text-gray-800 hover:text-gray-500 dark:hover:text-white px-3 py-2 rounded-md font-medium"
                >
                  <IconFaHome />
                  <span>Home</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="hidden sm:block">
            <div v-if="authUser" class="ml-4 flex items-center md:ml-6">
              <div class="ml-3 flex items-center">
                <div class="relative inline-block text-left">
                  <div @mouseenter="toggleDropdown" @click="toggleDropdown">
                    <a class="block relative">
                      <base-avatar-image
                        :alt="`${authUser.username}'s avatar`"
                        :src="authUser.avatar"
                        class="mx-auto object-cover rounded-full h-10 w-10"
                      />
                    </a>
                  </div>
                  <div
                    class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
                    :class="{ hidden: !showDropdown }"
                    @mouseleave="closeDropdown"
                  >
                    <div
                      class="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <router-link
                        :to="{
                          name: 'ProfilePage',
                          params: { id: authUser.id }
                        }"
                        class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                        role="menuitem"
                      >
                        <span class="flex flex-col">
                          <span>Profile</span>
                        </span>
                      </router-link>
                      <a
                        class="block block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600"
                        role="menuitem"
                        @click.prevent="signOut"
                      >
                        <span class="flex flex-col">
                          <span>Logout</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="md:block">
              <div class="flex items-baseline">
                <router-link
                  class="inline-flex items-center text-gray-800 hover:text-gray-500 dark:hover:text-white px-3 py-2 rounded-md font-medium"
                  :to="{ name: 'LoginPage' }"
                  >Sign In</router-link
                >

                <router-link
                  class="inline-flex items-center text-gray-800 hover:text-gray-500 dark:hover:text-white px-3 py-2 rounded-md font-medium"
                  :to="{ name: 'RegisterPage' }"
                  >Register</router-link
                >
              </div>
            </div>
          </div>
          <div class="block sm:hidden">
            <div
              class="flex justify-center items-center w-7 h-7 bg-transparent rounded"
              @click="toggleMobileNavMenu"
            >
              <IconFabars class="w-7 h-7 text-teal-700" />
            </div>
          </div>
        </div>
      </div>
      <transition-group name="fadeHeight">
        <div
          v-if="showMobileNavMenu"
          class="transition-height fixed bg-white w-full shadow sm:hidden"
        >
          <div v-if="authUser" class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <router-link
              :to="{ name: 'Home' }"
              class="text-gray-800 hover:text-gray-500 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >Home</router-link
            >
            <router-link
              :to="{
                name: 'ProfilePage',
                params: { id: authUser.id }
              }"
              class="text-gray-800 hover:text-gray-500 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </router-link>
            <a
              class="text-gray-800 hover:text-gray-500 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click.prevent="signOut"
            >
              Logout
            </a>
          </div>
          <div v-else class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <router-link
              :to="{ name: 'Home' }"
              class="text-gray-800 hover:text-gray-500 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >Home</router-link
            >
            <router-link
              class="text-gray-800 hover:text-gray-500 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              :to="{ name: 'LoginPage' }"
              >Sign In</router-link
            >

            <router-link
              class="text-gray-800 hover:text-gray-500 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              :to="{ name: 'RegisterPage' }"
              >Register</router-link
            >
          </div>
        </div>
      </transition-group>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import IconFaHome from '~icons/fa-solid/home'
import IconFabars from '~icons/fa-solid/bars'

export default {
  components: { IconFaHome, IconFabars },
  data() {
    return {
      showDropdown: false,
      showMobileNavMenu: false
    }
  },
  computed: {
    ...mapGetters({ authUser: 'auth/authUser' })
  },
  created() {
    this.$router.beforeEach(() => {
      this.showMobileNavMenu = false
    })
  },
  methods: {
    ...mapActions({ signOutUser: 'auth/signOut' }),
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    closeDropdown() {
      this.showDropdown = false
    },
    toggleMobileNavMenu() {
      this.showMobileNavMenu = !this.showMobileNavMenu
    },
    closeMobileNavMenu() {
      this.showMobileNavMenu = false
    },
    async signOut() {
      await this.signOutUser()
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
<style>
.fadeHeight-enter-active,
.fadeHeight-leave-active {
  @apply transition-all duration-300 ease max-h-52 opacity-100;
}
.fadeHeight-enter,
.fadeHeight-leave-to {
  @apply opacity-0 max-h-0 overflow-hidden;
}
</style>
