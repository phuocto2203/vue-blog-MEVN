import axiosClient from "./axiosClient";

const postApi = {
  getAllPosts(params) {
    const url = "/post";
    return axiosClient.get(url, params);
  },

  getPostById(postId) {
    const url = `/post/get-post-by-id/${postId}`;
    return axiosClient.get(url);
  },

  getPostsByUser(params) {
    const url = "/post/get-posts-by-user";
    return axiosClient.get(url, params);
  },

  createPost(formData) {
    const url = "post/create";
    return axiosClient.post(url, formData);
  },

  deletePost(postId) {
    const url = `post/delete/${postId}`;
    return axiosClient.delete(url);
  },

  updatePost(postId, formData) {
    const url = `post/update/${postId}`;
    return axiosClient.put(url, formData);
  },
};

export default postApi;
