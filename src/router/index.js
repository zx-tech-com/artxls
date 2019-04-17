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
//                 {
//                     path: 'milestone',
//                     component: resolve => require(['../components/page/milestone.vue'], resolve),
//                     meta: { title: '系统首页' }
//                 },
// 				{
// 				    path: '/info',
// 				    component: resolve => require(['../components/page/info.vue'], resolve),
// 				    meta: { title: '艺术家介绍' }
// 				},
				{
				    path: '/milestone',
				    component: resolve => require(['../components/page/milestone.vue'], resolve),
				    meta: { title: '艺术家生涯' }
				},
				{
				    path: '/photo',
				    component: resolve => require(['../components/page/photo.vue'], resolve),
				    meta: { title: '作品展览' },
				},
			    {
				    path: '/news',
				    component: resolve => require(['../components/page/news.vue'], resolve),
				    meta: { title: '资讯管理' }
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
