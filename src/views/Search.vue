<template>
  <h1 class="display-1 text-center my-5">
    Search on
  </h1>

  <v-row class="justify-center" :class="cindex===0 ? 'mb-n6' : ''"
         v-for="(chunk, cindex) in products" :key="cindex">
    <v-col md="2" v-for="(product, pindex) in chunk" :key="pindex">
      <v-card :to="{name: 'ProductDetails', params: {slug: product.slug}}"
          :loading="loading"
          class="mx-auto my-12"
          max-width="374"
      >
        <template slot="progress">
          <v-progress-linear
              color="deep-purple"
              height="10"
              indeterminate
          ></v-progress-linear>
        </template>

        <v-img
            height="250"
            :src="product.image"
        ></v-img>

        <v-card-title>
          {{ product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title }}
        </v-card-title>

        <v-card-text>

          <div class="my-4 text-subtitle-1">
            ${{ product.price }}
          </div>

          <div>
            {{ product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description }}
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-actions>
          <v-btn :to="{name: 'ProductDetails', params: {slug: product.slug}}"
              color="deep-purple lighten-2"
          >
            View Details
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {reactive, toRefs, onMounted} from "vue";
import axios from "axios";

export default {
  name: 'Home',
  props: ['search'],
  setup(props) {
    const data = reactive({
      loading : false,
      products: [],
    });

    const getProducts = () => {
      data.loading = true;
      axios.get('http://lr-simple-ecom-api.lcl/api/products/search/' + props.search)
          .then(res => {
            data.products = res.data;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            data.loading = false;
          });
    }

    onMounted(() => {
      getProducts();
    });

    return {
      ...toRefs(data)
    };
  }
};
</script>
