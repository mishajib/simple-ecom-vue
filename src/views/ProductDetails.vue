<template>
  <v-container>
    <v-row class="justify-center my-12">
      <v-col md="8">
        <v-card :loading="loading" class="mx-auto pb-6" max-width="450">
          <template slot="progress">
            <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
            ></v-progress-linear>
          </template>

          <v-img
              style="width: 100%; height: 450px;"
              :src="product.image"
          ></v-img>

          <v-card-title class="justify-center">
            {{ product.title }}
          </v-card-title>

          <h2 class="text-center">
            ${{ product.price }}
          </h2>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {onMounted, reactive, toRefs} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";

export default {
  name : "ProductDetails",
  props: ['slug'],
  setup(props) {
    const router = useRouter();

    const data = reactive({
      product: {},
      loading: false
    });

    const getProduct = () => {
      data.loading = true;
      axios.get(`http://lr-simple-ecom-api.lcl/api/products/${props.slug}`)
          .then(res => {
            console.log(res.data);
            data.product = res.data.data;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            data.loading = false;
          });
    }

    onMounted(() => {
      getProduct();
    });

    return {
      ...toRefs(data),
    }
  }
}
</script>