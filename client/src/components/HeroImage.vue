<template>
  <div class="hero-image__container">
    <swiper
      :spaceBetween="50"
      :centeredSlides="true"
      :autoplay="{
        delay: 2500,
        disableOnInteraction: false,
      }"
      :loop="true"
      :pagination="{
        clickable: true,
      }"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide v-for="image in images" :key="image.category">
        <img class="image" :src="image.source" alt="hero image" />
        <h3 class="text">{{ image.category }}</h3>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { reactive } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    let images = reactive([]);
    images = [
      {
        category: "LIFE STYLE",
        source: new URL("../assets/images/lifestyle.jpg", import.meta.url).href,
      },
      {
        category: "MUSIC",
        source: new URL("../assets/images/music.jpg", import.meta.url).href,
      },
      {
        category: "TRAVEL",
        source: new URL("../assets/images/travel.jpg", import.meta.url).href,
      },
      {
        category: "TECHNOLOGY",
        source: new URL("../assets/images/technology.jpg", import.meta.url)
          .href,
      },
    ];

    return {
      images,
      modules: [Autoplay, Pagination, Navigation],
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss" as *;
.image {
  width: 100%;
  height: 550px;
  object-fit: cover;
  opacity: 0.75;
  position: relative;

  @include mobile {
    height: 350px;
  }
}

.text {
  font-size: 7.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: 500;
  font-family: "Lora", sans-serif;

  @include tablet {
    font-size: 4rem;
  }
  @include mobile {
    font-size: 3rem;
  }
}

.hero-image__container {
  width: 100%;
  margin-bottom: 80px;
}
</style>
