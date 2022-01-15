<template>
  <VueFinalModal
    v-model="showModal"
    classes="modal-container"
    content-class="modal"
  >
    <div class="modal-content">
      <h4>Confirm your account to update the profile.</h4>
      <vForm @submit="reauthenticate">
        <base-form-field
          name="reauth-email"
          label="Email"
          v-model="email"
          rules="email"
        />
        <base-form-field
          name="reauth-password"
          label="Password"
          v-model="email"
          type="password"
        />
        <button class="btn btn-green btn-small">Login</button>
      </vForm>
    </div>
  </VueFinalModal>
</template>

<script>
import { mapActions } from 'vuex'
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    showModal: {
      get () {
        return this.modelValue
      },
      set (newValue) {
        this.$emit('update:modelValue', newValue)
      }
    }
  },
  methods: {
    ...mapActions('auth', ['reauthenticateUser']),
    async reauthenticate () {
      try {
        await this.reauthenticateUser({
          email: this.email,
          password: this.password
        })
        this.$emit('reAuthSuccess')
      } catch (error) {
        this.$emit('reAuthFailed', error)
      }
    }
  }
}
</script>
