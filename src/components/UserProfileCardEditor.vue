<template>
  <div class="col-3 push-top">
    <div class="profile-card">
      <vForm @submit="save">
        <p class="text-center avatar-edit flex justify-center items-center">
          <label for="avatar">
            <base-avatar-image
              :src="currentUser.avatar"
              :alt="`${currentUser.name} profile picture`"
              class="avatar-xlarge img-update"
              style="cursor: pointer"
            />
            <div class="avatar-upload-overlay">
              <base-spinner v-if="uploadingImage" color="#ffffff" />
              <fa-icon icon="camera" size="3x" :style="{ color: 'white', opacity: '8' }" />
            </div>
            <input
              v-show="false"
              @change="imageUploadHandler"
              type="file"
              id="avatar"
              accept="image/*"
            />
          </label>
        </p>
        <user-profile-card-editor-random-avatar
          class="mb-8"
          @randomAvatar="currentUser.avatar = $event"
        />

        <base-form-field
          v-model="currentUser.username"
          name="username"
          label="Username"
          type="text"
          placeholder="Username"
          :rules="{
            isRequired: true,
            unique: {
              collection: 'users',
              field: 'username',
              previousValue: user.username
            }
          }"
          extraClass="text-lead text-bold"
        />

        <base-form-field
          v-model="currentUser.name"
          name="name"
          label="Name"
          type="text"
          placeholder="Full Name"
          rules="isRequired"
          extraClass="text-lead"
        />

        <base-form-field
          v-model="currentUser.bio"
          as="textarea"
          label="Bio"
          name="bio"
          placeholder="Write a few words about yourself."
        />

        <base-form-field
          v-model="currentUser.website"
          name="website"
          label="Website"
          type="text"
          autocomplete="off"
          rules="url"
        />

        <base-form-field
          v-model="currentUser.email"
          name="email"
          label="Email"
          type="text"
          autocomplete="off"
          :rules="{
            isRequired: true,
            email: true,
            unique: {
              collection: 'users',
              field: 'email',
              previousValue: user.email
            }
          }"
        />

        <base-form-field
          v-model="currentUser.location"
          name="location"
          label="Location"
          type="text"
          list="locations"
          @focus="loadLocationOptions"
        />
        <datalist id="locations">
          <option
            v-for="(location, index) in locationOptions"
            :key="index"
            :value="location.name.common"
          ></option>
        </datalist>

        <div class="btn-group space-between">
          <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
          <button type="submit" class="btn-blue">Save</button>
        </div>
      </vForm>
      <user-reauthenticate
        v-model="needsReAuth"
        @reAuthSuccess="onReauthenticated"
        @reAuthFailed="onReauthenticatedFail"
      />
    </div>
  </div>
</template>

<script>
import { formatNoun } from '@/helpers'
import { mapActions } from 'vuex'
import UserProfileCardEditorRandomAvatar from './UserProfileCardEditorRandomAvatar.vue'
import UserReauthenticate from './UserReauthenticate.vue'
import useNotifications from '@/composables/useNotifications'

export default {
  components: { UserProfileCardEditorRandomAvatar, UserReauthenticate },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentUser: { ...this.user },
      uploadingImage: false,
      locationOptions: [],
      needsReAuth: false
    }
  },
  methods: {
    formatNoun,
    ...mapActions('users', ['updateUser']),
    ...mapActions('auth', ['uploadAvatar', 'updateEmail']),
    addNotification(notification) {
      const { addNotification } = useNotifications()
      addNotification({ ...notification })
    },
    async loadLocationOptions() {
      if (this.locationOptions.length) return
      const url = `${import.meta.env.VITE_REST_COUNTRIES_ENDPOINT}/all`
      const res = await fetch(url)
      const data = await res.json()

      data.sort(function (a, b) {
        const nameA = a.name.common.toUpperCase() // ignore upper and lowercase
        const nameB = b.name.common.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) return -1
        if (nameA > nameB) return 1
        // names must be equal
        return 0
      })

      this.locationOptions = data
    },
    async onReauthenticated() {
      await this.updateEmail({ email: this.currentUser.email })
      await this.saveUserData()
    },
    async onReauthenticatedFail() {
      this.addNotification({
        message: 'Failed confirming account.',
        timeout: 5000,
        type: 'error'
      })
      this.$router.push({ name: 'Profile' })
    },
    async saveUserData() {
      await this.updateUser(this.currentUser)
      this.$router.push({ name: 'Profile' })
      this.addNotification({
        message: 'User successfully updated',
        timeout: 3000
      })
    },
    async save() {
      const emailChanged = this.currentUser.email !== this.user.email
      if (emailChanged) {
        this.needsReAuth = true
      } else {
        await this.randomAvatarHandler()
        await this.saveUserData()
      }
    },
    cancel() {
      this.$router.push({ name: 'Profile' })
    },
    async imageUploadHandler(e) {
      this.uploadingImage = true
      const file = e.target.files[0]
      const uploadedImage = await this.uploadAvatar({ file })
      this.currentUser.avatar = uploadedImage || this.currentUser.avatar
      this.uploadingImage = false
    },
    async randomAvatarHandler() {
      const isUnsplashImage = this.currentUser.avatar.startsWith(
        'https://images.unsplash.com/'
      )
      if (isUnsplashImage) {
        const image = await fetch(this.currentUser.avatar)
        const blob = await image.blob()
        const filename = 'random'
        this.currentUser.avatar = await this.uploadAvatar({
          file: blob,
          filename
        })
      }
    }
  }
}
</script>

<style>
</style>
