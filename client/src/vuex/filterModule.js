export const filterModule = {
  state() {
    return {
      title: "",
      categories: [],
    };
  },

  mutations: {
    updateFilters(state, payload) {
      state.title = payload.title;
      state.categories = payload.categories;
    },
  },
};
