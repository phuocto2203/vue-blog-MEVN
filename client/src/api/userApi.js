import axiosClient from "./axiosClient";

const userApi = {
  register(data) {
    const url = "/auth/register";
    return axiosClient.post(url, data);
  },
  login(data) {
    const url = "auth/login";
    return axiosClient.post(url, data);
  },
  authenticate(access_token) {
    const url = "/auth";
    axiosClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${access_token}`;
    return axiosClient.get(url);
  },

  clearAuthorizationHeader() {
    delete axiosClient.defaults.headers.common["Authorization"];
  },
};

export default userApi;
