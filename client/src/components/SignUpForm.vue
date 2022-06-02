<template>
  <div class="container">
    <v-card class="sign-up-form__wrapper" elevation="4">
      <form class="sign-up-form__content" for="sign-up">
        <h1 class="sign-up-form__heading">Sign Up</h1>

        <label class="sign-up-form__label" for="full_name">Full Name</label>
        <input
          type="email"
          class="sign-up-form__input"
          v-model="state.fullname"
          id="full_name"
          :class="[v$.fullname.$error ? 'reset-margin' : '']"
        />
        <div
          class="sign-up-form__input-errors"
          v-for="error of v$.fullname.$errors"
          :key="error.$uid"
        >
          <small class="sign-up-form__error-msg">{{ error.$message }}</small>
        </div>

        <label class="sign-up-form__label" for="email">Email</label>
        <input
          type="email"
          class="sign-up-form__input"
          v-model="state.email"
          id="email"
          :class="[v$.email.$error ? 'reset-margin' : '']"
        />
        <div
          class="sign-up-form__input-errors"
          v-for="error of v$.email.$errors"
          :key="error.$uid"
        >
          <small class="sign-up-form__error-msg">{{ error.$message }}</small>
        </div>
        <label class="sign-up-form__label" for="username">Username</label>
        <input
          type="text"
          class="sign-up-form__input"
          v-model="state.username"
          id="username"
          :class="[v$.username.$error ? 'reset-margin' : '']"
        />
        <div
          class="sign-up-form__input-errors"
          v-for="error of v$.username.$errors"
          :key="error.$uid"
        >
          <small class="sign-up-form__error-msg">{{ error.$message }}</small>
        </div>
        <label class="sign-up-form__label" for="password">Password</label>
        <input
          type="password"
          class="sign-up-form__input"
          v-model="state.password"
          id="password"
          :class="[v$.password.$error ? 'reset-margin' : '']"
        />
        <div
          class="sign-up-form__input-errors"
          v-for="error of v$.password.$errors"
          :key="error.$uid"
        >
          <small class="sign-up-form__error-msg">{{ error.$message }}</small>
        </div>
        <label class="sign-up-form__label" for="password"
          >Confirm Password</label
        >
        <input
          type="password"
          class="sign-up-form__input"
          v-model="state.confirmPassword"
          id="confirmPassword"
          :class="[v$.confirmPassword.$error ? 'reset-margin' : '']"
        />
        <div
          class="sign-up-form__input-errors"
          v-for="error of v$.confirmPassword.$errors"
          :key="error.$uid"
        >
          <small class="sign-up-form__error-msg">{{ error.$message }}</small>
        </div>
        <v-btn
          v-if="!isLoading"
          color="blue-darken-2"
          class="sign-up-form__button"
          @click="submitForm"
          >Sign Up</v-btn
        >
        <v-btn
          v-if="isLoading"
          color="blue-darken-2"
          class="sign-up-form__button"
          @click="submitForm"
          disabled
          >Loading</v-btn
        >
        <small
          v-if="signUpError.isError"
          class="sign-up-form__error-msg"
          style="
            display: inline-block;
            width: 100%;
            text-align: center;
            margin-bottom: 10px;
          "
          >{{ signUpError.message }}</small
        >
        <div class="sign-up-form__link">
          <router-link :to="{ name: 'sign-in-route', params: {} }"
            >Already a user? Sign in here!</router-link
          >
        </div>
      </form>
    </v-card>
  </div>
</template>

<script>
import { reactive, computed, ref } from "vue";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { useRouter } from "vue-router";
import {
  required,
  minLength,
  maxLength,
  email,
  sameAs,
  helpers,
} from "@vuelidate/validators";

export default {
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const signUpError = ref({ isError: false, message: "" });

    const state = reactive({
      fullname: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    //use vuex store
    const store = useStore();

    //custom validation
    const upperCaseLettersMatch = (value) => {
      const upperCaseLetters = /[A-Z]/g;
      return value.match(upperCaseLetters);
    };

    const lowerCaseLettersMatch = (value) => {
      const lowerCaseLetters = /[a-z]/g;
      return value.match(lowerCaseLetters);
    };

    const numbersMatch = (value) => {
      const numbers = /[0-9]/g;
      return value.match(numbers);
    };

    const specialCharactersMatch = (value) => {
      const characters = /[!$&+,:;=?@#]/;
      return value.match(characters);
    };

    const rules = computed(() => ({
      fullname: {
        required,
        minLength: minLength(3),
      },
      email: {
        required,
        email,
      },
      username: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(12),
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(15),
        upperCaseLettersMatch: helpers.withMessage(
          "Must contain at least one uppercase letter",
          upperCaseLettersMatch
        ),
        lowerCaseLettersMatch: helpers.withMessage(
          "Must contain at least one lowercase letter",
          lowerCaseLettersMatch
        ),
        numbersMatch: helpers.withMessage(
          "Must contain at least one number",
          numbersMatch
        ),
        specialCharactersMatch: helpers.withMessage(
          "Must contain at least one special character",
          specialCharactersMatch
        ),
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs(state.password),
      },
    }));

    const v$ = useVuelidate(rules, state);

    const submitForm = async () => {
      const isFormCorrect = await v$.value.$validate();
      if (!isFormCorrect) {
        return;
      }

      //register
      isLoading.value = true;
      const response = await store.dispatch("register", state);
      isLoading.value = false;

      if (!response.success) {
        signUpError.value = { isError: true, message: response.message };
      }
      if (response.success) {
        router.push({ name: "home-route", params: {} });
      }

      return response;
    };
    return { state, v$, submitForm, isLoading, signUpError };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss/breakpoint" as *;

.container {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-up-form {
  &__wrapper {
    width: 600px;
    padding: 30px;
    @include tablet {
      width: 400px;
      margin: 0 30px;
    }
    @include mobile {
      width: 300px;
      margin: 0 30px;
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
  &__input-errors {
    margin-top: 0;
  }
  &__error-msg {
    color: red;
  }
}

.reset-margin {
  margin-bottom: 0;
}
</style>
