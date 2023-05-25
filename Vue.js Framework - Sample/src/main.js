import { createApp } from 'vue'
import App from './App.vue'



let app=createApp(App)

app.config.errorHandler = function (err, vm, info) {
  airbrake.notify({
    error: err,
    params: {info: info}
  });
}
app.mount("#app");
