<template>
  <div class="container">
    <base-head>
      <title>Login | Vorum</title>
      <meta property="og:title" content="Login" />
      <meta name="twitter:title" content="Login" />
    </base-head>
    <div class="flex-grid justify-center">
      <div class="col-2">
        <vForm class="card card-form" @submit="signIn">
          <h1 class="text-center">Login</h1>

          <base-form-field
            v-model="form.email"
            name="email"
            label="Email"
            type="email"
            :rules="{
              isRequired: true,
              email: true
            }"
          />
          <base-form-field
            v-model="form.password"
            name="password"
            label="Password"
            type="password"
            rules="isRequired"
          />

          <div class="push-top">
            <button type="submit" class="btn-blue btn-block">Log in</button>
          </div>

          <div class="form-actions text-right">
            <router-link :to="{ name: 'RegisterPage' }"
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

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: ''
})

const emit = defineEmits(['pageReady'])
async function signIn() {
  try {
    await store.dispatch('auth/signInWithEmailAndPassword', form.value)
    successRedirect()
  } catch (error) {}
}
async function loginWithGoogle() {
  await store.dispatch('auth/signInWithGoogle')
  successRedirect()
}
function successRedirect() {
  const redirectTo = route.query.redirectTo || { name: 'Home' }
  router.push(redirectTo)
}

emit('pageReady')
</script>

<style></style>
