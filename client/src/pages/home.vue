<template>
  <nav-bar></nav-bar>
  <hero-image></hero-image>
  <div class="filter-chip__container">
    <h2>Filters:</h2>
    <div
      class="filter-chips"
      v-for="chipFilter in chipFilters"
      :key="chipFilter"
    >
      <v-chip v-if="chipFilter" color="blue">{{ chipFilter }}</v-chip>
      <v-chip v-if="!chipFilter" color="primary">No Searching Keyword</v-chip>
    </div>
  </div>
  <div class="post__wrapper">
    <div v-if="!isFetching" class="posts__container" :key="rerenderTimes">
      <div v-for="(post, index) in posts" :key="index">
        <post v-if="post" :postProps="post"></post>
      </div>
    </div>
  </div>
  <pagination
    v-if="!isFetching"
    :key="rerenderTimes"
    :currentPage="currentPage"
    :totalPages="totalPages"
    @update:modelValue="handlePagination"
  ></pagination>
</template>

<script>
import postApi from "../api/postApi";
import HeroImage from "../components/HeroImage.vue";
import Post from "../components/Post.vue";
import NavBar from "../components/NavBar.vue";
import Pagination from "../components/Pagination.vue";
import { reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
export default {
  components: { HeroImage, Post, NavBar, Pagination },
  setup() {
    //vue router
    const router = useRouter();
    const route = useRoute();

    //vuex store
    const store = useStore();

    const chipFilters = ref([]);
    const rerenderTimes = ref(0);
    const isFetching = ref(true);
    const currentPage = ref(Number(route.query.page) || 1);
    const limitPost = ref(Number(route.query.limit) || 6);

    const totalPages = ref();

    const posts = ref([]);

    //handle pagination
    const handlePagination = (page) => {
      currentPage.value = page;
      router.push({
        name: "posts-route",
        query: {
          page: currentPage.value,
          limit: limitPost.value,
          category: [...store.state.filterModule.categories],
          title: store.state.filterModule.title,
        },
      });
    };

    //get all posts with pagination
    const getPosts = async () => {
      const params = {
        page: currentPage.value,
        limit: limitPost.value,
        category: route.query?.category || null,
        title: route.query?.title || null,
      };

      (params);
      try {
        const response = await postApi.getAllPosts({ params });
        totalPages.value = response?.totalPages || 1;
        posts.value = response?.posts || [];

        isFetching.value = false;
        rerenderTimes.value += 1;
      } catch (error) {
        return;
      }
    };

    getPosts();

    watch([currentPage, limitPost, () => route.query], () => {
      getPosts();
      chipFilters.value = [
        ...store.state.filterModule.categories,
        store.state.filterModule.title,
      ];
    });

    return {
      rerenderTimes,
      isFetching,
      currentPage,
      totalPages,
      posts,
      handlePagination,
      chipFilters,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss" as *;

.filter-chip__container {
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
  gap: 30px;
  align-items: center;
}

.post__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.posts__container {
  margin: 0 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 50px;

  @include laptop {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 750px) {
    grid-template-columns: 1fr;
  }
}
</style>
