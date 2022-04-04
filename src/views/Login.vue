<template>
  <v-card width="600" class="mx-auto mt-5">
    <v-card-title>
      <h3 class="display-1">Login</h3>
    </v-card-title>
    <v-form @submit.prevent="loginHandler">
      <v-card-text>
        <v-text-field
            label="Email"
            v-model="email"
            prepend-icon="mdi mdi-account"/>
        <v-text-field
            type="password"
            label="Password"
            v-model="password"
            prepend-icon="mdi mdi-lock"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success" variant="outlined" :to="{name: 'Register'}">Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info" type="submit" variant="outlined">Login</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>

  <v-snackbar :color="snackbar_color"
              v-model="snackbar">
    <span class="text-white">{{ snackbar_text }}</span>

    <template v-slot:actions>
      <v-btn
          :color="snackbar_btn_color"
          variant="text"
          @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import {reactive, toRefs} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {authComputed} from "@/store/helper";

export default {
  name    : "Login",
  computed: {
    ...authComputed
  },
  setup() {
    const store        = useStore();
    const router       = useRouter();
    const data         = reactive({
      snackbar          : false,
      snackbar_text     : '',
      snackbar_color    : '',
      snackbar_btn_color: 'pink',
      email             : "",
      password          : ""
    });
    const loginHandler = () => {
      store.dispatch('login', data)
          .then(() => {
            router.push({name: 'Dashboard'});
          })
          .catch(err => {
            if (err.response.data.hasOwnProperty('errors')) {
              for (let error in err.response.data.errors) {
                data.snackbar           = true;
                data.snackbar_color     = 'red';
                data.snackbar_btn_color = 'white';
                data.snackbar_text      = err.response.data.errors[error][0];
              }
            } else {
              data.snackbar           = true;
              data.snackbar_color     = 'red';
              data.snackbar_btn_color = 'white';
              data.snackbar_text      = err.response.data.message;
            }
          });
    }
    return {
      ...toRefs(data),
      loginHandler
    };
  }
}
</script>
