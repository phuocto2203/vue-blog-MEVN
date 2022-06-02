<template>
  <nav-bar></nav-bar>
  <hero-image></hero-image>
  <div class="about__wrapper">
    <div class="about__container">
      <h1>What is a blog?</h1>
      <p>
        A blog is a type of website that is updated regularly with new content.
        Most blogs contain short, informal articles called blog posts. These
        posts usually contain some combination of text, photos, videos, and
        other media. At its core, a blog is just a space on the Web that you can
        create to record and express your opinions, experiences, and interests.
        If you spend much time browsing the Web, you've probably read a blog
        post before, even if you didn't realize it at the time. Some of the
        most-read blogs are a bit like online magazines because they're written
        by a team of people who are paid to update the blog with new posts
        several times a day. However, a majority of blogs are written by one
        person. As a result, the average blog is fairly personal, reflecting the
        interests and personality of the person who writes it.
      </p>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import HeroImage from "../components/HeroImage.vue";
export default {
  components: { NavBar, HeroImage },
};
</script>

<style lang="scss" scoped>
.about {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  &__container {
    max-width: 700px;
    font-family: "Josefin Sans", sans-serif;

    h1 {
      font-size: 50px;
      font-weight: normal;
      text-align: center;
      margin-bottom: 50px;
    }

    p {
      margin: 0 50px 100px 50px;
    }
  }
}
</style>
