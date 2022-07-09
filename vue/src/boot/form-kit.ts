import { boot } from "quasar/wrappers";
import { plugin, defaultConfig } from "@formkit/vue";
import { createAutoAnimatePlugin } from "@formkit/addons";
import { pt } from "@formkit/i18n";
import "@formkit/themes/genesis";

export default boot(async ({ app }) => {
  app.use(
    plugin,
    defaultConfig({
      plugins: [createAutoAnimatePlugin()],
      locales: { pt },
      locale: "pt",
    })
  );
});
