/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import moment from 'moment';
import {Form, HasError, AlertError} from 'vform';

window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

// router
import VueRouter from 'vue-router'

Vue.use(VueRouter);


const routes = [
    {path: '/dashboard', component: require('./components/Dashboard').default},
    {path: '/profile', component: require('./components/Profile').default},
    {path: '/users', component: require('./components/Users').default},
    {path: '/developer', component: require('./components/Developer').default},
    {path: '*', component: require('./components/NotFound').default},
];

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});
////

//filter
Vue.filter('upText', function (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});
Vue.filter('myDate', function (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

//progress bar
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '2px'
});

//sweetalert
import Swal from 'sweetalert2'

window.swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});
window.Toast = Toast;

//
window.Fire = new Vue();

//passport
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);


//gate
import Gate from './Gate'

Vue.prototype.$gate = new Gate(window.user);

//404 not found
Vue.component(
    'not-found',
    require('./components/NotFound.vue').default
);

// pagination
Vue.component('pagination', require('laravel-vue-pagination'));


/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    router,
    data: {
        search: ''
    },
    methods: {
        searching: _.debounce(() => {
            Fire.$emit('searching');

        }, 1000),
        printme() {
            window.print();
        }
    },

}).$mount('#app');
