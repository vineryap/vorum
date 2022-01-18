<template>
  <div class="form-group">
    <label v-if="showLabel" :for="name">{{ label }}</label>
    <vField
      :id="name"
      :name="name"
      :label="label"
      :model-value="modelValue"
      class="form-input"
      :class="extraClass"
      v-bind="$attrs"
      @input="$emit('modelUpdate', $event)"
    />
    <vErrorMessage :name="name" class="form-error" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    label: { type: String, required: true },
    showLabel: { type: Boolean, default: true },
    modelValue: { type: String, default: '' },
    extraClass: { type: String, default: '' }
  },
  emits: ['modelUpdate']
}
</script>

<style></style>
