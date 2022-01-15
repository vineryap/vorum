<template>
  <div class="container">
    <div class="flex-grid justify-center">
      <div class="col-2">
        <vForm class="card card-form" @submit="signIn">
          <h1 class="text-center">Login</h1>

          <base-form-field
            name="email"
            label="Email"
            v-model="form.email"
            type="email"
            :rules="{
              isRequired: true,
              email: true
            }"
          />
          <base-form-field
            name="password"
            label="Password"
            v-model="form.password"
            type="password"
            rules="isRequired"
          />

          <div class="push-top">
            <button type="submit" class="btn-blue btn-block">Log in</button>
          </div>

          <div class="form-actions text-right">
            <router-link :to="{ name: 'Register' }"
              >Create an account?</router-link
            >
          </div>
        </vForm>

        <div class="push-top text-center">
          <button class="btn-red btn-xsmall" @click="loginWithGoogle">
            <i class="fa fa-google fa-btn"></i>Sign in with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions(['auth/signInWithEmailAndPassword', 'auth/signInWithGoogle']),
    async signIn () {
      try {
        await this['auth/signInWithEmailAndPassword'](this.form)
        this.successRedirect()
      } catch (error) {
        console.log(error)
      }
    },
    async loginWithGoogle () {
      await this['auth/signInWithGoogle']()
      this.successRedirect()
    },
    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    }
  },
  created () {
    this.$emit('pageReady')
  }
}
</script>

<style>
</style>
