<template>
  <div class="container">
    <div class="flex-grid justify-center">
      <div class="col-2">
        <vForm
          action=""
          class="card card-form rounded-xl shadow"
          @submit="register"
        >
          <h1 class="text-center">Register</h1>

          <base-form-field
            v-model="form.name"
            name="name"
            label="Name"
            type="text"
            rules="isRequired"
          />
          <base-form-field
            v-model="form.username"
            name="username"
            label="Username"
            type="text"
            rules="isRequired|unique:users,username"
          />
          <base-form-field
            v-model="form.email"
            name="email"
            label="Email"
            type="email"
            :rules="{
              isRequired: true,
              email: true,
              unique: { collection: 'users', field: 'email' }
            }"
          />
          <base-form-field
            v-model="form.password"
            name="password"
            label="Password"
            type="password"
            rules="isRequired|min:3"
          />

          <div class="form-group">
            <label for="avatar"
              >Avatar
              <div v-if="avatarPreview">
                <base-avatar-image
                  :src="avatarPreview"
                  alt="Avatar preview"
                  class="avatar-xlarge"
                />
              </div>
            </label>
            <vField
              v-show="!avatarPreview"
              id="avatar"
              name="avatar"
              label="Avatar"
              accept="image/*"
              type="file"
              class="form-input"
              @change="imageUploadHandler"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-blue btn-block">Register</button>
          </div>
        </vForm>
        <div class="text-center push-top">
          <button class="btn-red btn-xsmall" @click="registerWithGoogle">
            <i class="fa fa-google fa-btn"></i>Sign up with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  emits: ['pageReady'],
  data() {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: ''
      },
      avatarPreview: null
    }
  },
  created() {
    this.$emit('pageReady')
  },
  methods: {
    ...mapActions([
      'auth/registerUserWithEmailAndPassword',
      'auth/signInWithGoogle'
    ]),
    async register() {
      await this['auth/registerUserWithEmailAndPassword'](this.form)
      this.$router.push('/')
    },
    async registerWithGoogle() {
      await this['auth/signInWithGoogle']()
      this.$router.push('/')
    },
    imageUploadHandler(e) {
      this.form.avatar = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        this.avatarPreview = event.target.result
      }
      reader.readAsDataURL(this.form.avatar)
    }
  }
}
</script>

<style></style>
