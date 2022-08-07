<template>
  <v-card elevation="4" class="add-post__container">
    <form id="form" class="add-post__form" @submit.prevent="submitForm">
      <h1 class="add-post__heading">Add/edit a Post</h1>

      <small class="add-post__sub-heading">
        Please enter the following information and submit then.</small
      >
      <div class="add-post__break" />
      <label class="add-post__label" for="title">Title</label>
      <input
        v-model="state.title"
        class="add-post__input"
        type="text"
        id="title"
        name="title"
        :class="v$.title.$error ? 'reset-margin' : ''"
      />
      <div
        class="add-post__input-errors"
        v-for="error of v$.title.$errors"
        :key="error.$uid"
      >
        <small class="add-post__error-msg">{{ error.$message }}</small>
      </div>

      <label class="add-post__label" for="author">Author</label>
      <input
        v-model="state.author"
        class="add-post__input"
        type="text"
        name="author"
        id="author"
        :class="v$.author.$error ? 'reset-margin' : ''"
      />
      <div
        class="add-post__input-errors"
        v-for="error of v$.author.$errors"
        :key="error.$uid"
      >
        <small class="add-post__error-msg">{{ error.$message }}</small>
      </div>

      <label class="add-post__label" for="category">Category</label>

      <select
        v-model="state.category"
        style="cursor: pointer"
        class="add-post__input"
        name="category"
        id="category"
        :class="v$.category.$error ? 'reset-margin' : ''"
      >
        <option value="Life Style">Life Style</option>
        <option value="Music">Music</option>
        <option value="Technology">Technology</option>
        <option value="Travel">Travel</option>
      </select>

      <div
        class="add-post__input-errors"
        v-for="error of v$.category.$errors"
        :key="error.$uid"
      >
        <small class="add-post__error-msg">{{ error.$message }}</small>
      </div>

      <label class="add-post__label" for="description">Description</label>
      <div class="add-post__textarea">
        <QuillEditor
          v-model:content="state.description"
          contentType="html"
          :class="v$.category.$error ? 'reset-margin' : ''"
          name="description"
          toolbar="essential"
        ></QuillEditor>
      </div>
      <div
        class="add-post__input-errors"
        v-for="error of v$.description.$errors"
        :key="error.$uid"
      >
        <small class="add-post__error-msg">{{ error.$message }}</small>
      </div>

      <label class="add-post__label" for="image">Upload an image</label>
      <input type="file" class="upload-input" id="image" name="image" />

      <div class="submit-btn__container">
        <v-btn type="submit" depressed color="blue-darken-2" class="submit-btn"
          >Submit</v-btn
        >
      </div>
    </form>
  </v-card>
</template>

<script>
import { computed, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useRoute } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  props: ["oldPostProps"],
  components: {
    QuillEditor,
  },
  setup(props, context) {
    const route = useRoute();

    const state = reactive({
      title: props?.oldPostProps?.title || "",
      author: props?.oldPostProps?.author || "",
      category: props?.oldPostProps?.category || "",
      description: props?.oldPostProps?.description || "",
    });

    const rules = computed(() => ({
      title: {
        required,
      },
      author: {
        required,
      },
      category: {
        required,
      },
      description: {
        required,
      },
    }));

    const v$ = useVuelidate(rules, state);

    const submitForm = async () => {
      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) {
        return;
      }
      const form = document.getElementById("form");

      const formData = new FormData(form);

      formData.append("description", state.description);

      if (route.name === "add-post-route") {
        context.emit("submit-post", formData);
      }
      if (route.name === "edit-post-route") {
        context.emit("update-post", formData);
      }
    };

    return { state, v$, submitForm };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss/" as *;

.add-post {
  &__container {
    width: 1000px;
    margin-bottom: 80px;
    margin-top: 80px;
    @include laptop {
      width: 700px;
    }
    @include tablet {
      width: 500px;
    }
    @include mobile {
      width: 350px;
    }
  }
  &__heading {
  }
  &__sub-heading {
    margin-bottom: 30px;
  }
  &__form {
    width: 100%;
    padding: 50px;
  }
  &__label {
    display: block;
  }
  &__input {
    border: solid 0.5px gray;
    border-radius: 4px;
    padding: 5px;
    width: 100%;
    margin-bottom: 30px;
  }
  &__heading {
    margin-bottom: 10px;
  }
  &__sub-heading {
    margin-bottom: 30px;
  }
  &__break {
    border-bottom: solid 0.2px gray;
    margin-bottom: 30px;
  }
  &__textarea {
    width: 100%;
    resize: none;
    height: 200px;
    margin-bottom: 70px;
    padding: 5px;
    @media screen and (max-width: 610px) {
      margin-bottom: 110px;
    }
  }
  &__input-errors {
    color: red;
  }
}

.upload-input {
  border: solid 0.5px gray;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 30px;
  cursor: pointer;
}

.submit-btn__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .submit-btn {
  }
}

.reset-margin {
  margin: 0;
}
</style>
