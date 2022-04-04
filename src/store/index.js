import {createStore} from 'vuex'
import axios from 'axios';

export default createStore({
    state: {
        user: null,
        homeProducts: [],
    },
    mutations: {
        SET_USER_DATA(state, userData) {
            state.user = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        },
        CLEAR_USER_DATA(state) {
            state.user = null;
            localStorage.removeItem('user');
            axios.defaults.headers.common['Authorization'] = null;
        }
    },
    actions: {
        register({commit}, data) {
            return axios.post('http://lr-simple-ecom-api.lcl/api/register', data);
        },
        login({commit}, data) {
            return axios.post('http://lr-simple-ecom-api.lcl/api/login', data)
                .then(({data}) => {
                    commit('SET_USER_DATA', data.data);
                });
        },
        logout({commit}) {
            return axios.post('http://lr-simple-ecom-api.lcl/api/logout')
                .then(({data}) => {
                    commit('CLEAR_USER_DATA');
                });
        },
    },
    getters: {
        isAuthenticated(state) {
            return !!state.user;
        }
    },
    modules: {}
})
