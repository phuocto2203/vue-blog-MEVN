<template>
  <nav-bar></nav-bar>
  <div class="posts__wrapper">
    <h1 style="color: black">Your Posts:</h1>

    <div v-if="!isFetching" class="posts__container" :key="rerenderTimes">
      <div v-for="(post, index) in posts" :key="index">
        <post
          v-if="post"
          :postProps="post"
          @delete-post="handleDeletePost"
          @edit-post="handleEditPost"
        ></post>
      </div>
    </div>

    <pagination
      v-if="!isFetching"
      :key="rerenderTimes"
      :currentPage="params.page"
      :totalPages="totalPages"
      @update:modelValue="handlePagination"
    ></pagination>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import Post from "../components/Post.vue";
import Pagination from "../components/Pagination.vue";
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import postApi from "../api/postApi";

export default {
  components: { NavBar, Post, Pagination },
  setup() {
    //vue-router
    const router = useRouter();
    const route = useRoute();

    //vuex store
    const store = useStore();

    const rerenderTimes = ref(0);

    const isFetching = ref(true);

    const totalPages = ref(0);

    const posts = ref();

    //protect route -check if user is authenticated
    watch(
      () => store.state.userModule.isAuthenticated,
      () => {
        window.location.reload();
      }
    );

    //check for authenticated user
    (async () => {
      await store.dispatch("checkAuthenticatedUser");
      if (!store.state.userModule.isAuthenticated) {
        router.push({ name: "home-route", params: {} });
      }
    })();

    let params = ref({
      page: Number(route.query?.page) || 1,
      limit: Number(route.query?.limit) || 6,
      title: route.query?.title || "",
      category: route.query?.category || "",
    });

    const handlePagination = (page) => {
      params.value.page = page;
      router.push({
        name: "your-posts-route",
        query: {
          page: params.value.page,
          limit: params.value.limit,
          category: [...store.state.filterModule.categories],
          title: store.state.filterModule.title,
        },
      });
    };

    const getPosts = async () => {
      params.value = {
        page: Number(route.query?.page) || 1,
        limit: Number(route.query?.limit) || 6,
        title: route.query?.title || "",
        category: route.query?.category || "",
      };
      params.value;

      try {
        const response = await postApi.getPostsByUser({ params: params.value });
        posts.value = response.posts;
        response.posts;

        totalPages.value = response.totalPages || 0;

        rerenderTimes.value += 1;
        isFetching.value = false;
      } catch (error) {
        return;
      }
    };

    getPosts();

    watch(
      () => route.query,
      () => {
        getPosts();
      }
    );

    //handle deleting a  post
    const handleDeletePost = async (postId) => {
      try {
        await postApi.deletePost(postId);
        getPosts();
      } catch (error) {
        return;
      }
    };

    //handle editing a post
    const handleEditPost = (postId) => {
      router.push({ name: "edit-post-route", params: { id: postId } });
    };

    return {
      isFetching,
      rerenderTimes,
      totalPages,
      params,
      posts,
      handlePagination,
      handleDeletePost,
      handleEditPost,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss" as *;
.posts {
  &__wrapper {
    margin-top: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  &__container {
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 30px;

    @include laptop {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 750px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
