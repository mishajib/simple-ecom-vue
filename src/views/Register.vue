<template>
  <v-card width="600" class="mx-auto mt-5">
    <v-card-title>
      <h3 class="display-1">Registration</h3>
    </v-card-title>
    <v-form @submit.prevent="registerHandler">
      <v-card-text>
        <v-text-field
            prepend-inner-icon="mdi mdi-account"
            v-model="name"
            label="Name"/>
        <v-text-field
            prepend-inner-icon="mdi mdi-email"
            v-model="email"
            label="Email"/>
        <v-text-field
            prepend-inner-icon="mdi mdi-lock"
            :append-inner-icon="showPassword ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"/>
        <v-text-field
            prepend-inner-icon="mdi mdi-lock"
            :append-inner-icon="showPassword ? 'mdi mdi-eye' : 'mdi mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            v-model="password_confirmation"
            :type="showPassword ? 'text' : 'password'"
            label="Password Confirmation"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="success" variant="outlined" :to="{name: 'Login'}">Login</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="info" variant="outlined" type="submit">Register</v-btn>
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

export default {
  name: "Register",
  setup() {
    const store        = useStore();
    const router       = useRouter();
    const showPassword = reactive({
      showPassword: false
    });
    const data         = reactive({
      snackbar             : false,
      snackbar_text        : '',
      snackbar_color       : '',
      snackbar_btn_color   : 'pink',
      name                 : "",
      email                : "",
      password             : "",
      password_confirmation: "",
      is_admin             : false,
    });

    const registerHandler = () => {
      store.dispatch('register', data)
          .then(res => {
            data.snackbar           = true;
            data.snackbar_color     = 'success';
            data.snackbar_btn_color = 'pink';
            data.snackbar_text      = res.data.message;
            router.push({name: 'Login'});
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
    };

    return {
      ...toRefs(data),
      ...toRefs(showPassword),
      registerHandler
    };
  },
}
</script>
