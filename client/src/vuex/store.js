import { createStore } from "vuex";
import { userModule } from "./userModule";
import { filterModule } from "./filterModule";

const store = createStore({
  modules: {
    userModule,
    filterModule,
  },
});

export default store;
