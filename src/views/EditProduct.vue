<template>
  <v-card width="600" class="mx-auto mt-5">
    <v-card-title class="justify-center">
      <h3 class="display-1">Edit Product</h3>
    </v-card-title>
    <v-form @submit.prevent="updateHandler">
      <v-card-text>
        <v-text-field
            v-model="title"
            label="Title"/>
        <v-text-field
            v-model="slug"
            label="Slug"/>
        <v-text-field
            v-model.number="price"
            label="Price"/>
        <v-text-field
            v-model.number="quantity"
            label="Quantity"/>
        <v-text-field
            @change="imageUploadHandler($event)"
            label="Image"
            type="file"/>
        <v-text-field
            v-model="description"
            label="Description"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="outlined" type="submit">
          Update
        </v-btn>
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
import {reactive, toRefs, onMounted} from "vue";
import axios from "axios";

export default {
  name : "EditProduct",
  props: ['id'],
  setup(props) {
    const data   = reactive({
      snackbar          : false,
      snackbar_text     : '',
      snackbar_color    : '',
      snackbar_btn_color: 'pink',
      _method           : 'PUT',
      title             : "",
      slug              : "",
      description       : "",
      price             : "",
      image             : null,
      quantity          : "",
    });

    const getProduct = () => {
      axios.get(`http://lr-simple-ecom-api.lcl/api/admin/products/${props.id}`)
          .then(response => {
            data.title       = response.data.data.title;
            data.slug        = response.data.data.slug;
            data.price       = response.data.data.price;
            data.quantity    = response.data.data.quantity;
            data.description = response.data.data.description;
          })
          .catch(err => {
            data.snackbar           = true;
            data.snackbar_color     = 'red';
            data.snackbar_btn_color = 'white';
            data.snackbar_text      = err.response.data.message;
          });
    };

    const updateHandler = () => {
      axios.post(`http://lr-simple-ecom-api.lcl/api/admin/products/${props.id}`, data)
          .then(res => {
            getProduct();
            data.snackbar           = true;
            data.snackbar_color     = 'success';
            data.snackbar_btn_color = 'pink';
            data.snackbar_text      = res.data.message;
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

    const imageUploadHandler = (event) => {
      data.image = event.target.files[0];
    };

    onMounted(() => {
      getProduct();
    });

    return {
      ...toRefs(data),
      updateHandler,
      imageUploadHandler
    };
  },
}
</script>
