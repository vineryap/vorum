<template>
  <div class="col-full">
    <vForm @submit="submit" :key="formKey">
      <base-form-field
        v-model="form.text"
        :showLabel="false"
        as="textarea"
        label="Post content"
        name="text"
        cols="30"
        rows="10"
        rules="isRequired"
      />
      <div class="form-actions">
        <button v-if="post.id" @click.prevent="cancel" class="btn-ghost">
          Cancel
        </button>
        <button class="btn-blue">
          {{ post.id ? 'Update Post' : 'Submit Post' }}
        </button>
      </div>
    </vForm>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => ({
        text: ''
      })
    }
  },
  data () {
    return {
      form: { ...this.post },
      formKey: Date.now()
    }
  },
  methods: {
    submit () {
      this.$emit('save', { post: this.form })
      this.form.text = ''
      this.formKey = Date.now()
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style>
</style>
