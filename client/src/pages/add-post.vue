<template>
  <div class="add-post__container">
    <nav-bar></nav-bar>
    <add-post-form @submit-post="handleSubmitPost"></add-post-form>
  </div>
</template>

<script>
import AddPostForm from "../components/AddPostForm.vue";
import NavBar from "../components/NavBar.vue";
import postApi from "../api/postApi";
import { useStore } from "vuex";
import { watch } from "vue";
import { useRouter } from "vue-router";
export default {
  components: {
    AddPostForm,
    NavBar,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    watch(
      () => store.state.userModule.isAuthenticated,
      () => {
        window.location.reload();
      }
    );

    const handleSubmitPost = async (formData) => {
      try {
        const response = await postApi.createPost(formData);
        (response);
        router.push({
          name: "post-detail-route",
          params: { id: response.newPost._id },
        });
      } catch (error) {
        return;
      }
    };

    return {
      handleSubmitPost,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-post {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
