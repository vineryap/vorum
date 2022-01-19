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
          <div class="block">
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
                <a
                  class="inline-flex items-center text-gray-800 hover:text-gray-500 dark:hover:text-white px-3 py-2 rounded-md font-medium"
                  href="/#"
                >
                  <router-link :to="{ name: 'LoginPage' }">Sign In</router-link>
                </a>
                <a
                  class="inline-flex items-center text-gray-800 hover:text-gray-500 dark:hover:text-white px-3 py-2 rounded-md font-medium"
                  href="/#"
                >
                  <router-link :to="{ name: 'RegisterPage' }"
                    >Register</router-link
                  >
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showMobileNavMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
            >Home</a
          >
          <a
            class="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
            >Gallery</a
          >
          <a
            class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
            >Content</a
          >
          <a
            class="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
            >Contact</a
          >
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import IconFaHome from '~icons/fa-solid/home'

export default {
  components: { IconFaHome },
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
<style></style>
