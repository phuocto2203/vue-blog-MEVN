// Styles
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as styles from "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

// Vuetify
import { createVuetify } from "vuetify";
export default createVuetify({
  components,
  directives,
  styles,
  icons: {
    iconfont: "mdi",
  },
});
