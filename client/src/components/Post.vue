<template>
  <div class="post__container">
    <router-link
      :to="{
        name: 'post-detail-route',
        params: { id: post.id },
      }"
    >
      <v-card class="mx-auto post__card">
        <div
          class="post__img__container"
          @mouseover="isHover = true"
          @mouseleave="isHover = false"
        >
          <img
            v-if="post.image"
            class="post__img"
            :src="'data:image/jpeg;base64,' + post.image"
          />

          <img
            v-if="!post.image"
            class="post__img"
            src="src/assets/images/no-image.jpg"
          />

          <div
            v-if="this.$route.name === 'your-posts-route'"
            class="post-overlay__container"
            :class="{ show: isHover }"
          >
            <div class="icon-buttons" :class="{ show__icons: isHover }">
              <span
                @click="handleEditPost"
                class="material-icons-outlined edit-icon"
              >
                edit
              </span>
              <span
                @click="handleDeletePost"
                class="material-icons delete-icon"
              >
                delete_forever
              </span>
            </div>
          </div>
        </div>
        <v-card-title class="justify-center">
          {{ postProps.title }}
        </v-card-title>
        <div style="position: block; width: 100%; margin-bottom: 40px">
          <v-chip
            style="
              justify-content: center;
              width: 80px;
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
            "
            color="blue"
            >{{ post.category }}</v-chip
          >
        </div>
        <v-card-subtitle class="justify-center">
          {{ post.time }}
        </v-card-subtitle>
        <v-card-text>
          {{ truncate(post?.description || "", 300) }}
        </v-card-text>
      </v-card>
    </router-link>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { truncate } from "../utils/truncate";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
export default {
  props: ["postProps"],
  setup(props, context) {
    const isHover = ref(false);

    dayjs.extend(relativeTime);

    const post = reactive({
      id: props.postProps?._id || null,
      title: props.postProps?.title || null,
      author: props.postProps?.author || null,
      category: props.postProps?.category || null,
      description: props.postProps?.description || null,
      time:
        dayjs(new Date(props.postProps?.updatedAt)).toNow(true) + " ago" ||
        dayjs(new Date(props.postProps?.createdAt)).toNow(true) + " ago" ||
        "",
      image: props.postProps?.image.base64File || null,
    });

    const handleDeletePost = (event) => {
      event.stopPropagation();
      event.preventDefault();
      context.emit("delete-post", post.id);
    };

    const handleEditPost = (event) => {
      event.stopPropagation();
      event.preventDefault();
      context.emit("edit-post", post.id);
    };

    return {
      isHover,
      truncate,
      post,
      handleDeletePost,
      handleEditPost,
    };
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.post {
  &__container {
    width: 300px;
    margin-bottom: 80px;
    cursor: pointer;
  }
  &__card {
    height: 600px;
    border-radius: 1rem;
    overflow: hidden;
  }

  &-overlay__container {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    position: absolute;
    width: 100%;
    height: 200px;
    top: 0;
    left: 0;
    background: black;
    cursor: pointer;
    visibility: hidden;
    opacity: 0;
    transition: all 0.5s ease-in-out;

    .icon-buttons {
      color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
    }
    .edit-icon {
      color: white;
      font-size: 30px;
      transition: all 0.3s linear;
      &:hover {
        font-size: 40px;
        font-weight: 600;
      }
    }
    .delete-icon {
      color: white;
      margin-left: 50px;
      font-size: 30px;
      transition: all 0.3s linear;
      &:hover {
        font-size: 40px;
        font-weight: 600;
      }
    }
  }
  &__img {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}

.show {
  visibility: visible;
  opacity: 0.6;
}
</style>
