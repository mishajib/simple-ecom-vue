<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col>
          <v-form @submit.prevent="getProducts">
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                placeholder="Search"
            ></v-text-field>
          </v-form>
        </v-col>
        <v-col>
          <v-btn color="info" class="float-end" prepend-icon="mdi mdi-plus" :to="{name: 'StoreProduct'}">
            Add Product
          </v-btn>
        </v-col>
      </v-row>

    </v-card-title>
    <v-table>
      <thead>
      <tr>
        <th class="text-left">
          Image
        </th>
        <th class="text-left">
          Title
        </th>
        <th class="text-left">
          Price
        </th>
        <th class="text-left">
          Action
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(product, index) in products"
          :key="index"
      >
        <td>
          <img height="80" width="80" :src="product.image" :alt="product.slug">
        </td>
        <td>{{ product.title }}</td>
        <td>{{ product.price }}</td>
        <td>
          <v-btn color="info" class="mr-2" size="small" :to="{name: 'EditProduct', params: {id: product.id}}"
                 icon="mdi mdi-pencil">
            Edit
          </v-btn>
          <v-btn color="error" size="small" @click="deleteProduct(product.id)" icon="mdi mdi-delete">
          </v-btn>
        </td>
      </tr>
      </tbody>
    </v-table>
    <div class="text-center">
      <v-pagination
          v-model="meta.current_page"
          :length="meta.last_page"
          :total-visible="5"
      ></v-pagination>
    </div>
  </v-card>
</template>

<script>
import {reactive, toRefs, onMounted, watch} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter();
    const store  = useStore();

    const data = reactive({
      search  : '',
      meta    : {
        current_page: 1,
      },
      products: [],
    });

    const getProducts   = () => {
      axios.get(`http://lr-simple-ecom-api.lcl/api/admin/products?page=${data.meta.current_page}&search=${data.search}`)
          .then(response => {
            data.products = response.data.data;
            data.meta     = response.data.meta;
          })
          .catch(error => {
            console.log(error);
          });
    };
    const deleteProduct = (id) => {
      axios.delete(`http://lr-simple-ecom-api.lcl/api/admin/products/${id}`)
          .then(res => {
            getProducts();
          })
          .catch(error => {
            console.log(error);
          });
    };
    watch(
        () => data.meta.current_page,
        () => getProducts()
    )

    watch(
        () => data.search,
        () => getProducts()
    )

    onMounted(() => {
      getProducts();
    });

    return {
      ...toRefs(data),
      getProducts,
      deleteProduct
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
};
</script>
