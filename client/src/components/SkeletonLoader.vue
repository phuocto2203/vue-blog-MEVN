<template>
  <div class="skeleton__container">
    <v-card class="mx-auto skeleton__card">
      <Skeletor width="inherit" height="200" />
      <Skeletor class="mt-5 mx-auto" width="70%" height="10" />
      <Skeletor class="mt-5 mx-auto" width="90%" height="10" />
      <Skeletor class="mt-5 mx-auto" width="90%" height="10" />
      <Skeletor class="mt-5 mx-auto" width="90%" height="10" />
      <Skeletor class="mt-5 mx-auto" width="90%" height="10" />
    </v-card>
  </div>
</template>

<script>
import { Skeletor } from "vue-skeletor";
export default {
  components: { Skeletor },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.skeleton {
  &__container {
    width: 300px;
    margin-bottom: 80px;
    cursor: pointer;
  }
  &__card {
    height: 400px;
  }
}
</style>
