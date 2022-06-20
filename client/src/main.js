import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./routers/index";
import store from "./vuex/store";
import "vue-skeletor/dist/vue-skeletor.css";

import "./styles/reset.scss";

let app = createApp(App);
loadFonts();

app.use(vuetify);
app.use(store);
app.use(router);
app.mount("#app");
