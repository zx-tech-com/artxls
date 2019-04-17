import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
			component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: 'dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                   // 富文本编辑器组件
                   path: '/editor',
                   component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                   meta: { title: '富文本编辑器' }
				},
				{
				    path: '/food',
				    component: resolve => require(['../components/page/food/food-list.vue'], resolve),
				    meta: { title: '菜品管理' }
				},
				{
				    path: '/info',
				    component: resolve => require(['../components/page/info.vue'], resolve),
				    meta: { title: '艺术家介绍' }
				},
				{
				    path: '/milestone',
				    component: resolve => require(['../components/page/milestone.vue'], resolve),
				    meta: { title: '艺术家生涯' }
				},
				
				{
				    path: '/photo',
				    component: resolve => require(['../components/page/photo.vue'], resolve),
				    meta: { title: '作品展览' }
				},
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
