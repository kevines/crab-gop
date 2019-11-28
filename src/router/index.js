import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  // 忘记密码
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: '修改密码', noCache: true }
      }
    ],
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})


//首页左侧栏菜单
export const asyncRouterMap = [
  
  //用户管理
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'userManage',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [
      {
        path: 'daikin/list',
        component: () => import('@/views/user/app/list'),
        name: 'appUser',
        meta: {
          title: '平台用户',
          noCache: true
        }
      }
    ]
  },
  //蟹券管理
  {
    path: '/ticket',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'ticketManage',
    meta: {
      title: '蟹券管理',
      icon: 'ticket'
    },
    children: [
      {
        path: 'exchange/specification/list',
        component: () => import('@/views/ticket/exchange/specification/list'),
        name: 'noExchangeList',
        meta: {
          title: '兑换券管理',
          noCache: true
        }
      },
      {
        path: 'all/exchange/list',
        component: () => import('@/views/ticket/exchange/all/list'),
        name: 'allExchangeList',
        meta: {
          title: '总兑换列表',
          noCache: true
        }
      },
      {
        path: 'have/exchange/list',
        component: () => import('@/views/ticket/exchange/converted/list'),
        name: 'haveExchangeList',
        meta: {
          title: '已兑换列表',
          noCache: true
        }
      },
      {
        path: 'all/exchange/detail',
        component: () => import('@/views/ticket/exchange/all/detail'),
        name: 'allExchangeDetail',
        meta: {
          title: '总兑换券详情',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'have/exchange/detail',
        component: () => import('@/views/ticket/exchange/converted/detail'),
        name: 'haveExchangeDetail',
        meta: {
          title: '已兑换详情',
          noCache: true
        },
        hidden: true
      },
    ]
  },
  // 系统配置
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          title: '运营账号管理',
          noCache: true
        }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]
