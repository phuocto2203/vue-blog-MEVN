<template>
  <nav-bar></nav-bar>
  <sign-in-form></sign-in-form>
</template>

<script>
import SignInForm from "../components/SignInForm.vue";
import NavBar from "../components/NavBar.vue";

export default {
  components: {
    SignInForm,
    NavBar,
  },
};
</script>

<style></style>
