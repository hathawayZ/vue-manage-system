import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
// import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';

Vue.config.productionTip = false;
// Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
// const i18n = new VueI18n({
//     locale: 'zh',
//     messages
// });

import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

import axios from 'axios';
Vue.prototype.$axios = axios //全局注册，使用方法为:this.$axios
Vue.prototype.baseUrl = 'http://localhost:8080';

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title}`;
    const role = localStorage.getItem('ms_username');
    console.log(to);
    // if (!role && to.path !== '/login') {
    //     next('/login');
    // } else 
    if (to.meta.super_permission) {
        if (role === "admin") {
            next();
        } else {
            this.$message.error('当前用户没有超级管理员权限');
            next(flase);
        }
    } else if (to.meta.permission) {
        // 
        if (role)
            next();
        else {
            next('/login');
        }
    } else {
        next();
    }
});

new Vue({
    router,
    // i18n,
    render: h => h(App)
}).$mount('#app');