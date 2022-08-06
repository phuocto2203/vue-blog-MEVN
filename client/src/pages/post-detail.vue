<template>
  <nav-bar></nav-bar>
  <div class="post-detail__container">
    <div v-if="!isLoading" class="post-detail__content">
      <h2 class="post-detail__title">
        {{ postDetail.title }}
      </h2>

      <hr class="post-detail__break" />

      <h4 class="post-detail__author">Author: {{ postDetail.author }}</h4>
      <small class="post-detail__published-date"
        >Published: {{ postDetail.updatedAt }}</small
      >
      <div class="post-detail__hero-image">
        <img
          v-if="postDetail.image.file"
          :src="'data:image/jpeg;base64,' + postDetail.image.file"
        />
        <img
          v-if="!postDetail.image.file"
          src="../assets/images/no-image.jpg"
        />
      </div>

      <div class="post-detail__text" v-html="postDetail.description"></div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import NavBar from "../components/NavBar.vue";
import postApi from "../api/postApi";
import { useRoute } from "vue-router";
export default {
  components: { NavBar },

  setup(props) {
    const route = useRoute();

    const postDetail = ref({});
    const isLoading = ref(true);

    const getPostDetail = async () => {
      try {
        const response = await postApi.getPostById(route.params.id);

        postDetail.value = response.post;

        (postDetail.value = {
          ...postDetail.value,
          updatedAt: new Date(postDetail.value.updatedAt),
        }),
          postDetail.value;
        isLoading.value = false;
      } catch (error) {
        return;
      }
    };
    getPostDetail();

    return {
      postDetail,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.post-detail {
  &__container {
    margin: 100px 30px 80px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__hero-image {
    margin: 30px;
    width: 80%;
    height: 340px;
  }
  &__hero-image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
  }
  &__title {
    width: 60%;
    text-align: center;
  }

  &__break {
    margin: 30px 0 30px 0;
    width: 60%;
  }
  &__text {
    width: 80%;
  }
}
</style>
