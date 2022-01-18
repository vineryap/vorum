<template>
  <vForm @submit="save">
    <base-form-field
      v-model="form.title"
      label="Title"
      type="text"
      name="title"
      rules="isRequired"
    />
    <base-form-field
      v-model="form.content"
      as="textarea"
      name="content"
      label="Content"
      rows="8"
      cols="140"
      rules="isRequired"
    />
    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="cancel">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ isEdit ? 'Update' : 'Publish' }}
      </button>
    </div>
  </vForm>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
      required: false
    },
    content: {
      type: String,
      default: '',
      required: false
    }
  },
  data() {
    return {
      form: {
        title: this.title,
        content: this.content
      }
    }
  },
  computed: {
    isEdit() {
      return !!this.title
    }
  },
  watch: {
    form: {
      handler() {
        if (
          this.form.title !== this.title ||
          this.form.content !== this.content
        ) {
          // a dirty form is a form with unsaved changes.
          this.$emit('dirty')
        }
      },
      deep: true
    }
  },
  methods: {
    async save() {
      const formData = { ...this.form }
      const title = formData.title.trim()
      const content = formData.content.trim()

      if (title && content) {
        this.$emit('clean')
        this.$emit('save', {
          title,
          text: content
        })
        return
      }
      alert('Title and content must be filled.')
    },
    cancel() {
      this.$emit('clean')
      this.$emit('cancel')
    }
  }
}
</script>

<style></style>
