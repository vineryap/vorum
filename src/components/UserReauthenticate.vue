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
          v-model="email"
          name="reauth-email"
          label="Email"
          rules="email"
        />
        <base-form-field
          v-model="password"
          name="reauth-password"
          label="Password"
          type="password"
        />
        <button class="btn btn-green btn-small">Update Email</button>
      </vForm>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { computed, ref, toRefs } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import { useStore } from 'vuex'

const store = useStore()
const emit = defineEmits(['reAuthSuccess', 'reAuthFailed', 'update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const { modelValue } = toRefs(props)
const email = ref('')
const password = ref('')
const showModal = computed({
  get: () => modelValue.value,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  }
})

async function reauthenticate() {
  try {
    await store.dispatch('auth/reauthenticateUser', {
      email: email.value,
      password: password.value
    })
    emit('reAuthSuccess')
  } catch (error) {
    emit('reAuthFailed', error)
  }
}
</script>
