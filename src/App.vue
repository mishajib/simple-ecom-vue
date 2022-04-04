<template>
  <v-app>
    <v-app-bar app color="primary" density="compact" absolute>
      <v-app-bar-title>
        <v-btn :to="{name: 'Home'}">
          Simple Ecom
        </v-btn>
      </v-app-bar-title>

      <v-spacer></v-spacer>
      <v-text-field v-model="search" @submit.prevent="searchHandler"
                    label="Search"
                    bg-color="white"
                    name="name"
                    placeholder="Search"
                    append-inner-icon="mdi mdi-magnify"
                    @click:append-inner="searchHandler"
      ></v-text-field>
      <v-btn class="mr-2" :to="{name: 'Home'}">Home</v-btn>
      <v-btn class="mr-3" :to="{name: 'Register'}" v-if="!isAuthenticated">
        Register
      </v-btn>
      <v-btn class="mr-3" :to="{name: 'Login'}" v-if="!isAuthenticated">
        Login
      </v-btn>
      <v-btn class="mr-2" :to="{name: 'Dashboard'}" v-if="isAuthenticated">Dashboard</v-btn>
      <v-btn class="mr-3" @click.prevent="logout" v-if="isAuthenticated">
        Logout
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import {reactive, toRefs} from "vue";
import {authComputed} from "@/store/helper";
import axios from "axios";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  name    : 'App',
  computed: {
    ...authComputed
  },
  setup() {
    const router = useRouter();
    const store  = useStore();

    const data = reactive({
      search: '',
    });

    const logout = () => {
      store.dispatch('logout')
          .then(() => {
            router.push({name: 'Home'})
          });
    };

    const searchHandler = () => {
      router.push({name: 'Search', params: {search: data.search}});
    };
    return {
      ...toRefs(data),
      logout,
      searchHandler
    }
  },
  created() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.$store.commit('SET_USER_DATA', user);
    }
    axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response.status === 401) {
            this.$store.dispatch('logout')
                .then(() => {
                  this.$router.push({name: 'Home'})
                });
          }
          return Promise.reject(error);
        }
    );
  }
}
</script>
