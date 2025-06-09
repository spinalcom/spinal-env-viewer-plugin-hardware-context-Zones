<template>
  <div>
    <md-field>
      <label>Hardware Context name</label>
      <md-input v-model="contextName_comp"></md-input>
    </md-field>
  </div>
</template>

<script>
export default {
  name: "CfgLinkTreezone",
  data() {
    return {};
  },
  props: {
    contextName: {
      type: String,
      required: true
    }
  },
  computed: {
    contextName_comp: {
      get() {
        return this.contextName;
      },
      set(value) {
        this.$emit('update:contextName', value);
      }
    }
  }
};
</script>

<style scoped></style>
