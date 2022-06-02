<template>
  <div class="container">
    <v-card class="sign-in-form__wrapper" elevation="4">
      <form
        @submit.prevent="submitForm"
        class="sign-in-form__content"
        for="sign-in"
      >
        <h1 class="sign-in-form__heading">Sign In</h1>
        <label class="sign-in-form__label" for="username">Username</label>
        <input
          type="text"
          class="sign-in-form__input"
          id="username"
          v-model="state.username"
          :class="[v$.username.$error ? 'reset-margin' : '']"
        />
        <div
          class="sign-in-form__input-errors"
          v-for="error of v$.username.$errors"
          :key="error.$uid"
        >
          <small class="sign-in-form__error-msg" style="color: red">{{
            error.$message
          }}</small>
        </div>
        <label class="sign-in-form__label" for="password">Password</label>
        <input
          type="password"
          class="sign-in-form__input"
          id="password"
          v-model="state.password"
          :class="[v$.username.$error ? 'reset-margin' : '']"
        />
        <div
          class="sign-in-form__input-errors"
          v-for="error of v$.password.$errors"
          :key="error.$uid"
        >
          <small class="sign-in-form__error-msg" style="color: red">{{
            error.$message
          }}</small>
        </div>
        <v-btn
          v-if="!isLoading"
          color="blue-darken-2"
          class="sign-in-form__button"
          type="submit"
          :class="[loginError.isError ? 'reset-margin' : '']"
          >Sign In</v-btn
        >
        <v-btn
          v-if="isLoading"
          color="blue-darken-2"
          class="sign-in-form__button"
          type="submit"
          disabled
          >Loading...</v-btn
        >

        <small
          v-if="loginError.isError"
          class="sign-in-form__error-msg"
          style="
            display: inline-block;
            width: 100%;
            color: red;
            margin: 30px 0 10px 0;
            text-align: center;
          "
          >{{ loginError.message }}</small
        >
        <div class="sign-in-form__link">
          <router-link :to="{ name: 'sign-up-route', params: {} }"
            >Not a user? Sign up here!</router-link
          >
        </div>
      </form>
    </v-card>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { reactive, computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const store = useStore();

    const isLoading = ref(false);

    let loginError = ref({ isError: false, message: "" });

    const state = reactive({
      username: "",
      password: "",
    });
    const rules = computed(() => ({
      username: {
        required,
      },
      password: {
        required,
      },
    }));

    const v$ = useVuelidate(rules, state);

    const submitForm = async () => {
      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) {
        return;
      }
      isLoading.value = true;
      const response = await store.dispatch("login", state);
      if (!response.success) {
        loginError.value = { isError: true, message: response.message };
      }

      isLoading.value = false;

      if (response.success) {
        router.push({ name: "home-route", params: {} });
      }

      (loginError);
    };
    return {
      state,
      v$,
      submitForm,
      isLoading,
      loginError,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss" as *;
.container {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-in-form {
  &__wrapper {
    width: 600px;
    padding: 30px;
    @include tablet {
      width: 300px;
    }
  }
  &__heading {
    margin-bottom: 35px;
    text-align: center;
  }
  &__label {
    margin-bottom: 30px;
  }
  &__input {
    display: block;
    border: 1px solid gray;
    width: 100%;
    border-radius: 4px;
    padding: 4px;
    margin-bottom: 30px;
  }
  &__button {
    width: 100%;
    padding: 5px;
    margin-bottom: 30px;
  }
  &__link {
    width: 100%;
    display: flex;
    justify-content: center;
    a {
      color: blue;
      text-decoration: none;
    }
  }
}

.reset-margin {
  margin: 0;
}
</style>
