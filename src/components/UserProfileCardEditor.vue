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
              <fa-icon
                icon="camera"
                size="3x"
                :style="{ color: 'white', opacity: '8' }"
              />
            </div>
            <input
              v-show="false"
              id="avatar"
              type="file"
              accept="image/*"
              @change="imageUploadHandler"
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
          extra-class="text-lead text-bold"
        />

        <base-form-field
          v-model="currentUser.name"
          name="name"
          label="Name"
          type="text"
          placeholder="Full Name"
          rules="isRequired"
          extra-class="text-lead"
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
    </div>
    <user-reauthenticate
      v-model="needsReAuth"
      @re-auth-success="onReauthenticated"
      @re-auth-failed="onReauthenticatedFail"
    />
  </div>
</template>

<script setup>
import { formatNoun, mapActions } from '@/helpers'
import UserProfileCardEditorRandomAvatar from './UserProfileCardEditorRandomAvatar.vue'
import UserReauthenticate from './UserReauthenticate.vue'
import useNotifications from '@/composables/useNotifications'
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { addNotification } = useNotifications()
const props = defineProps({ user: { type: Object, required: true } })
const { user } = toRefs(props)

const currentUser = reactive({ ...user.value })
const uploadingImage = ref(false)
const locationOptions = ref([])
const needsReAuth = ref(false)

const { updateUser } = mapActions('users')
const { uploadAvatar, updateUserEmail } = mapActions('auth')
async function loadLocationOptions() {
  if (locationOptions.value.length) return
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

  locationOptions.value = data
}
async function onReauthenticated() {
  await updateUserEmail({ email: currentUser.email })
  await saveUserData()
}
async function onReauthenticatedFail() {
  addNotification({
    message: 'onReauthenticatedFail Failed confirming account.',
    timeout: 5000,
    type: 'error'
  })
  router.push({ name: 'Profile' })
}
async function saveUserData() {
  await updateUser(currentUser)
  router.push({ name: 'Profile' })
  addNotification({
    message: 'User successfully updated',
    timeout: 3000
  })
}
async function save() {
  const emailChanged = currentUser.email !== user.value.email
  if (emailChanged) {
    needsReAuth.value = true
  } else {
    await randomAvatarHandler()
    await saveUserData()
  }
}
function cancel() {
  router.push({ name: 'Profile' })
}
async function imageUploadHandler(e) {
  uploadingImage.value = true
  const file = e.target.files[0]
  const uploadedImage = await uploadAvatar({ file })
  currentUser.avatar = uploadedImage || currentUser.avatar
  uploadingImage.value = false
}
async function randomAvatarHandler() {
  const isUnsplashImage = currentUser.avatar.startsWith(
    'https://images.unsplash.com/'
  )
  if (isUnsplashImage) {
    const image = await fetch(currentUser.avatar)
    const blob = await image.blob()
    const filename = 'random'
    currentUser.avatar = await uploadAvatar({
      file: blob,
      filename
    })
  }
}
</script>

<style></style>
