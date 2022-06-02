import Cookies from "js-cookie";
import userApi from "../api/userApi";
import cookieKeys from "../constants/cookieKeys";

export const userModule = {
  state() {
    return {
      currentUser: "",
      isAuthenticated: false,
    };
  },
  mutations: {
    authenticate(state, payload) {
      state.currentUser = Cookies.get(cookieKeys.USER) || "";
      state.isAuthenticated = true;
    },
    logout(state, payload) {
      //clear cookies
      Cookies.remove(cookieKeys.USER);
      Cookies.remove(cookieKeys.TOKEN);

      //clear authorization header
      userApi.clearAuthorizationHeader();

      state.currentUser = "";
      state.isAuthenticated = false;
    },
  },
  actions: {
    async register({ commit, state }, userData) {
      try {
        const response = await userApi.register(userData);
        Cookies.set(cookieKeys.USER, response.username);
        Cookies.set(cookieKeys.TOKEN, response.accessToken);

        commit("authenticate");

        return response;
      } catch (error) {
        return error;
      }
    },
    async login({ commit, state }, userData) {
      try {
        const response = await userApi.login(userData);

        Cookies.set(cookieKeys.USER, response.username);
        Cookies.set(cookieKeys.TOKEN, response.accessToken);

        commit("authenticate");

        return response;
      } catch (error) {
        return error;
      }
    },

    async checkAuthenticatedUser({ commit, state }) {
      try {
        const access_token = Cookies.get(cookieKeys.TOKEN);
        if (!access_token) {
          return;
        }
        const response = await userApi.authenticate(access_token);
        commit("authenticate");
        return response;
      } catch (error) {
        return error;
      }
    },
  },
};
