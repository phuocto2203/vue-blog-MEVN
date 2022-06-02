<template>
  <div class="add-post__container">
    <nav-bar></nav-bar>
    <add-post-form
      v-if="!isLoading"
      :oldPostProps="oldPost"
      @update-post="handleSubmitPost"
    ></add-post-form>
  </div>
</template>

<script>
import AddPostForm from "../components/AddPostForm.vue";
import NavBar from "../components/NavBar.vue";
import postApi from "../api/postApi";
import { useStore } from "vuex";
import { watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  components: {
    AddPostForm,
    NavBar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const oldPost = ref();
    const isLoading = ref(true);

    watch(
      () => store.state.userModule.isAuthenticated,
      () => {
        window.location.reload();
      }
    );

    //get old post
    (async () => {
      try {
        const response = await postApi.getPostById(route.params.id);
        oldPost.value = response?.post;
        isLoading.value = false;
      } catch (error) {
        return;
      }
    })();

    const handleSubmitPost = async (formData) => {
      const postId = route.params.id;
      (formData);
      try {
        const response = await postApi.updatePost(postId, formData);
        (response);
        router.push({
          name: "post-detail-route",
          params: { id: route.params.id },
        });
      } catch (error) {
        (error);
      }
    };

    return {
      handleSubmitPost,
      oldPost,
      isLoading,
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
