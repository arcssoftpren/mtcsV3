/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify';
import pinia from '@/stores';
import router from '@/router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// Types of plugins: https://vuejs.org/guide/scaling-up/plugins.html#plugin-types
pinia.use(piniaPluginPersistedstate);

export function registerPlugins(app) {
  app.use(vuetify).use(router).use(pinia);
}
