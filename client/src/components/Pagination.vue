<template>
  <v-pagination v-model="page" :length="length"></v-pagination>
</template>

<script>
import { ref } from "vue";

export default {
  props: ["currentPage", "totalPages"],
  setup(props, context) {
    const page = ref(props.currentPage);

    const length = ref(props.totalPages);

    return { page, length };
  },
};
</script>

<style></style>
