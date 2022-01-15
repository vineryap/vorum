<template>
  <div class="form-group">
    <label v-if="showLabel" :for="name">{{ label }}</label>
    <vField
      :name="name"
      :label="label"
      :modelValue="modelValue"
      :id="name"
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
  }
}
</script>

<style>
</style>
