<template>
  <div class="n-radio radio" :class="`radio-${type}`">
    <input :id="cbId" type="radio"
           :checked="model===true"
           :disabled="disabled"
           :value="label"
           v-model="model">
    <label :for="cbId">
      <slot></slot>
    </label>
  </div>
</template>
<script>
  export default{
    name: 'p-radio',
    model: {
      prop: 'value'
    },
    props: {
      label: [String, Number],
      disabled: [Boolean, String],
      value: [String, Boolean],
      type: {
        type: String,
        default: 'neutral'
      }
    },
    data () {
      return {
        cbId: ''
      }
    },
    computed: {
      model: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      }
    },
    created () {
      this.cbId = Math.random().toString(16).slice(2)
    }
  }
</script>
