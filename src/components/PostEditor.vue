<template>
  <div class="col-full">
    <vForm :key="formKey" @submit="submit">
      <base-form-field
        v-model="form.text"
        :show-label="false"
        as="textarea"
        label="Post content"
        name="text"
        cols="30"
        rows="10"
        rules="isRequired"
      />
      <div class="form-actions">
        <button v-if="post.id" class="btn-ghost" @click.prevent="cancel">
          Cancel
        </button>
        <button class="btn-blue">
          {{ post.id ? 'Update Post' : 'Submit Post' }}
        </button>
      </div>
    </vForm>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'

const emit = defineEmits(['save', 'cancel'])
const props = defineProps({
  post: {
    type: Object,
    default: () => ({
      text: ''
    })
  }
})
const { post } = toRefs(props)
const form = reactive({ ...post.value })
const formKey = ref(Date.now())

function submit() {
  emit('save', { post: form })
  form.text = ''
  formKey.value = Date.now()
}
function cancel() {
  emit('cancel')
}
</script>

<style></style>
