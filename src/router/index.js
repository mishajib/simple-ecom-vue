import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/admin/dashboard',
        name: 'Dashboard',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/admin/products',
        name: 'StoreProduct',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "add_products" */ '../views/AddProduct.vue'),
        meta: {requiresAuth: true}
    },
    {
        path: '/admin/products/:id',
        name: 'EditProduct',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "edit_product" */ '../views/EditProduct.vue'),
        meta: {requiresAuth: true},
        props: true
    },
    {
        path: '/register',
        name: 'Register',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
        meta: {guest: true}
    },
    {
        path: '/login',
        name: 'Login',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
        meta: {guest: true}
    },
    {
        path : '/products/:slug',
        name : 'ProductDetails',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component : () => import(/* webpackChunkName: "product_details" */ '../views/ProductDetails.vue'),
        props     : true,
    },
    {
        path : '/products/search/:search',
        name : 'Search',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component : () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
        props     : true,
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    // Get user string from local storage
    const isAuthenticated  = localStorage.getItem('user');
    const user = isAuthenticated ? JSON.parse(isAuthenticated).user : null;

    // If route is restricted and user is not authenticated
    if ((to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) && (user && !user.is_admin)) {
        next('/');
    }

    // If route is not restricted and user is authenticated
    if((to.matched.some(record => record.meta.guest) && isAuthenticated) && (user && user.is_admin)) {
        next('/admin/dashboard');
    }

    // If route is not restricted and user is not authenticated
    next();
});

export default router
