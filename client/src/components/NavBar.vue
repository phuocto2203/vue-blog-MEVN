<template>
  <div class="nav-bar__container">
    <nav class="nav-bar">
      <div class="start">
        <router-link :to="{ name: 'home-route', params: {} }">
          <img class="logo" src="../assets/images/logo.png" alt="" />
        </router-link>
      </div>
      <div class="middle">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link :to="{ name: 'home-route', params: {} }"
              >HOME</router-link
            >
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'about-route', params: {} }"
              >ABOUT</router-link
            >
          </li>
          <OnClickOutside
            @trigger="() => (isShowedMenu = false)"
            class="nav-item"
          >
            <li v-on:click="handleDropDownMenu">
              <span>CATEGORIES</span>

              <div class="drop-down__menu" :class="{ show: isShowedMenu }">
                <div class="drop-down__list">
                  <v-checkbox
                    class="drop-down__list-item"
                    v-model="filters.categories"
                    label="Life Style"
                    value="lifestyle"
                  ></v-checkbox>

                  <v-checkbox
                    class="drop-down__list-item"
                    v-model="filters.categories"
                    label="Music"
                    value="music"
                  ></v-checkbox>

                  <v-checkbox
                    class="drop-down__list-item"
                    v-model="filters.categories"
                    label="Technology"
                    value="technology"
                  ></v-checkbox>

                  <v-checkbox
                    class="drop-down__list-item"
                    v-model="filters.categories"
                    label="Travel"
                    value="travel"
                  ></v-checkbox>
                </div>
              </div>
            </li>
          </OnClickOutside>
          <li class="nav-item">
            <router-link :to="{ name: 'add-post-route', params: {} }"
              >ADD POSTS</router-link
            >
          </li>
        </ul>
      </div>

      <h1 class="brand">VUE BLOG</h1>
      <div class="end">
        <div class="search__container">
          <input
            :value="filters.title"
            @input="handleSearch"
            class="search-bar"
          />
          <span class="material-icons" style="cursor: pointer"> search </span>
        </div>

        <OnClickOutside @trigger="() => (isShowedProfileMenu = false)">
          <div class="profile__container" v-on:click="handleProfileMenu">
            <div class="profile__wrapper">
              <img
                src="../assets/images/user-solid.svg"
                style="width: 25px; height: 25px"
                alt=""
              />
            </div>

            <div class="profile__menu" :class="{ show: isShowedProfileMenu }">
              <router-link
                v-if="!isAuthenticated"
                class="profile__item"
                :to="{ name: 'sign-in-route', params: {} }"
                >Sign in</router-link
              >

              <router-link
                v-if="!isAuthenticated"
                class="profile__item"
                :to="{ name: 'sign-up-route', params: {} }"
                >Sign up</router-link
              >

              <router-link
                v-if="isAuthenticated"
                class="profile__item"
                :to="{ name: 'your-posts-route', params: {} }"
                >Your posts</router-link
              >
              <button
                @click="handleLogout"
                v-if="isAuthenticated"
                class="profile__item"
              >
                Logout
              </button>
            </div>
          </div>
        </OnClickOutside>

        <p v-if="isAuthenticated" class="profile__username">
          Hello, {{ username }}
        </p>
        <div class="hamburger__icon">
          <button
            class="hamburger__button"
            @click="isShowedHamburgerMenu = !isShowedHamburgerMenu"
          >
            <span class="material-icons"> menu </span>
          </button>
        </div>
      </div>
    </nav>
  </div>
  <br />

  <nav
    class="hamburger__menu"
    :class="[
      isShowedHamburgerMenu ? 'show-hamburger-menu' : 'hide-hamburger-menu',
    ]"
  >
    <div class="hamburger-search__container">
      <input
        placeholder="Search for title"
        :value="filters.title"
        @input="handleSearch"
        class="hamburger-search-bar"
      />
    </div>

    <div class="hamburger__menu-container">
      <ul class="hamburger__menu-nav-list">
        <li class="hamburger__menu-nav-item">
          <router-link :to="{ name: 'home-route', params: {} }"
            >HOME</router-link
          >
        </li>
        <li class="hamburger__menu-nav-item">
          <router-link :to="{ name: 'about-route', params: {} }"
            >ABOUT</router-link
          >
        </li>

        <li class="hamburger__menu-nav-item">
          <span
            style="display: flex; align-items: center"
            @click.stop="isShowedHamburgerCheckbox = !isShowedHamburgerCheckbox"
          >
            <span> CATEGORIES </span>
            <span class="material-icons"> keyboard_arrow_down </span>
          </span>

          <div
            class="hamburger-drop-down__menu"
            :class="[
              isShowedHamburgerCheckbox
                ? 'show-hamburger-drop-down'
                : 'hide-hamburger-drop-down',
            ]"
          >
            <div class="hamburger-drop-down__list">
              <v-checkbox
                class="hamburger-drop-down__list-item"
                v-model="filters.categories"
                label="Life Style"
                value="lifestyle"
              ></v-checkbox>

              <v-checkbox
                class="hamburger-drop-down__list-item"
                v-model="filters.categories"
                label="Music"
                value="music"
              ></v-checkbox>

              <v-checkbox
                class="hamburger-drop-down__list-item"
                v-model="filters.categories"
                label="Technology"
                value="technology"
              ></v-checkbox>

              <v-checkbox
                class="hamburger-drop-down__list-item"
                v-model="filters.categories"
                label="Travel"
                value="travel"
              ></v-checkbox>
            </div>
          </div>
        </li>

        <li class="hamburger__menu-nav-item">
          <router-link :to="{ name: 'add-post-route', params: {} }"
            >ADD POSTS</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref, watch, reactive } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { OnClickOutside } from "@vueuse/components";

export default {
  components: {
    OnClickOutside,
  },
  setup() {
    //handle show menu
    const isShowedMenu = ref(false);
    const isShowedProfileMenu = ref(false);
    const isShowedHamburgerMenu = ref(false);
    const isShowedHamburgerCheckbox = ref(false);

    function handleDropDownMenu() {
      isShowedMenu.value = !isShowedMenu.value;
      (isShowedMenu.value);
    }
    function handleProfileMenu() {
      isShowedProfileMenu.value = !isShowedProfileMenu.value;
    }

    //vuex store
    const store = useStore();

    //vue router
    const router = useRouter();
    const route = useRoute();

    const filters = reactive({ title: "", categories: [] });
    const isAuthenticated = ref(false);
    const username = ref("");

    //check if user is currently authenticated
    (async () => {
      const response = await store.dispatch("checkAuthenticatedUser");
      isAuthenticated.value = store.state.userModule.isAuthenticated;
      username.value = response?.user.fullname.split(" ")[0];
    })();

    //handle logout
    const handleLogout = () => {
      store.commit("logout");
      isAuthenticated.value = store.state.userModule.isAuthenticated;
      username.value = "";
    };

    //handle search with debounce
    const handleSearch = (event) => {
      setTimeout(() => {
        filters.title = event.target.value;
      }, 1000);
    };

    // handle filters
    watch(filters, () => {
      const currentFilters = store.state.filterModule;
      store.commit("updateFilters", filters);

      if (route.name === "your-posts-route")
        router.push({
          name: "your-posts-route",
          query: {
            category: [...currentFilters.categories],
            title: currentFilters.title,
          },
        });

      if (route.name === "posts-route" || route.name === "home-route")
        router.push({
          name: "posts-route",
          query: {
            category: [...currentFilters.categories],
            title: currentFilters.title,
          },
        });
    });

    return {
      filters,
      isAuthenticated,
      username,
      handleLogout,
      isShowedMenu,
      isShowedProfileMenu,
      handleDropDownMenu,
      handleProfileMenu,
      handleSearch,
      isShowedHamburgerCheckbox,
      isShowedHamburgerMenu,
    };
  },
};
</script>

<style lang="scss" scoped>
@use "../scss/" as *;
.nav-bar__container {
  position: fixed;
  z-index: 999;
  padding: 10px;
  width: 100%;
  background: white;
}
a {
  color: inherit;
  text-decoration: none;
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 0 auto;
  @include tablet {
    justify-content: space-between;
  }
}
.logo {
  width: 40px;
  height: 40px;
}

.nav-list {
  display: flex;
  list-style: none;
  justify-content: center;
  align-items: center;
  font-family: "Josefin Sans", sans-serif;
  font-weight: 300;
  font-size: 22px;
}

.start {
  @include tablet {
    margin-left: 50px;
  }
}
.nav-item {
  margin-left: 30px;
  cursor: pointer;
}
.middle {
  @include tablet {
    display: none;
  }
}

.drop-down {
  &__menu {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    background: white;
    width: 150px;
    padding: 20px;
    transition: all 0.4s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__list-item {
    padding: 5px;
    :hover {
      color: rgb(51, 190, 255);
    }
    font-size: 15px;
  }
}
:deep .drop-down__list-item .v-label {
  font-size: 20px;
}

.end {
  display: flex;
  align-items: center;
  @include tablet {
    justify-content: flex-end;
    margin-right: 50px;
    gap: 20px;
  }
}

.material-icons {
  font-size: 30px;
  margin-left: 10px;
}

.search__container {
  display: flex;
  align-items: center;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0 5px;
  @include tablet {
    display: none;
  }
}
.search-bar {
}

.profile {
  &__wrapper {
    margin-left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: lightblue;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
  }

  &__menu {
    visibility: hidden;
    opacity: 0;
    width: 100%;
    position: absolute;
    background: white;
    width: 150px;
    padding: 20px;
  }

  &__item {
    font-family: "Josefin Sans", sans-serif;
    font-weight: 300;
    font-size: 22px;
    display: block;
    padding: 5px;
  }
  &__item:hover {
    color: lightblue;
  }
  &__username {
    font-family: "Josefin Sans", sans-serif;
    font-weight: 300;
    font-size: 22px;
    margin-left: 5px;
  }
}

.hamburger {
  &__button {
    display: none;
    font-size: 50px;
    @include tablet {
      display: block;
    }
  }

  &__menu-nav-list {
    margin-top: 70%;
  }

  &-search__container {
    display: flex;
    background: gray;
    opacity: 1;
    height: 30px;
    border-radius: 5px;
    margin-top: 150px;

    .hamburger-search-bar {
      padding: 5px;
      width: inherit;
      height: inherit;
      color: white;
      font-weight: 700;
    }
    &:focus {
      outline: none;
    }
    input::placeholder {
      color: white;
    }
  }

  &__menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    background: black;
    opacity: 0.5;
    height: 100%;
    width: 50vw;
    z-index: 99;
    right: 0;
    color: white;
    transform: translateX(100%);
    transition: all 0.5s ease-in-out;

    @include mobile {
      width: 100vw;
    }

    &-container {
      li {
        list-style-type: none;
      }
    }

    &-nav-item {
      font-family: "Josefin Sans", sans-serif;
      font-weight: 200;
      font-size: 30px;
      margin-bottom: 80px;

      cursor: pointer;
      &:hover {
        font-weight: 700;
      }
    }
  }

  &-drop-down {
    &__menu {
      display: none;
      :deep .hamburger-drop-down__list-item .v-label {
        font-size: 20px;
        font-weight: 400;
      }
      margin-top: 30px;
    }
    &__list-item {
      font-size: 15px;
    }
  }
}

.brand {
  display: none;
  @include tablet {
    display: block;
    font-family: "Josefin Sans", sans-serif;
    font-weight: 200;
    font-size: 30px;
    text-align: center;
  }

  @include mobile {
    display: none;
  }
}
.show {
  visibility: visible;
  opacity: 1;
}

.show-hamburger-drop-down {
  display: block;
}
.hide-hamburger-drop-down {
  display: none;
}

.show-hamburger-menu {
  transform: translateX(0);
}
.hide-hamburger-menu {
  transform: translateX(100%);
}
</style>
