<template>
  <v-card width="600" class="mx-auto mt-5">
    <v-card-title class="justify-center">
      <h3 class="display-1">Add Product</h3>
    </v-card-title>
    <v-form @submit.prevent="storeHandler" enctype="multipart/form-data">
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
            accept="image/*"
            type="file"/>
        <v-text-field
            v-model="description"
            label="Description"/>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" variant="outlined" type="submit">
          Save
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
import {reactive, toRefs} from "vue";
import axios from "axios";

export default {
  name: "AddProduct",
  setup() {
    const data = reactive({
      snackbar          : false,
      snackbar_text     : '',
      snackbar_color    : '',
      snackbar_btn_color: 'pink',
      title             : "",
      slug              : "",
      description       : "",
      price             : "",
      image             : null,
      quantity          : "",
    });

    const storeHandler = () => {
      let formData = new FormData();
      formData.append('title', data.title);
      formData.append('slug', data.slug);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('quantity', data.quantity);
      if (data.image) {
        formData.append('image', data.image);
      }
      axios.post(`http://lr-simple-ecom-api.lcl/api/admin/products`, formData)
          .then(res => {
            data.snackbar           = true;
            data.snackbar_color     = 'success';
            data.snackbar_btn_color = 'pink';
            data.snackbar_text      = res.data.message;
            data.title = '';
            data.description = '';
            data.image = null;
            data.price = '';
            data.quantity = '';
            data.slug = '';
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

    const imageUploadHandler = (e) => {
      data.image = e.target.files[0];
    };

    return {
      ...toRefs(data),
      storeHandler,
      imageUploadHandler
    };
  },
}
</script>
