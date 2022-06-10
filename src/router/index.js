import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index.vue'
import ItemsFor from '@/components/items-for.vue'
import SelectItems from '@/components/select-items.vue'
import GoodsOutbound from '@/components/goods-outbound.vue'
import ProductInventory from '@/components/product-inventory.vue'
import DealtDone from '@/components/dealt-done.vue'
import TodoDetail from '@/components/todo-detail.vue'
import EntryGoods from '@/components/entry-goods.vue'
import MyApply from '@/components/my-apply.vue'
import ApplyDetail from '@/components/apply-detail.vue'
import Auth from '@/components/auth.vue'
import Auth2 from '@/components/auth2.vue'
import Login from '@/components/login.vue'
import Logout from '@/components/logout.vue'
import ApplyHistory from '@/components/apply-history.vue'
import Test from '@/components/test.vue'


Vue.use(Router)
const router = new Router({
  // mode:'history',
  // base:'/ui',
  routes: [
    {
      path: '/',
      component: Test,
    },
    {
      path: '/test',
      component: Test,
      meta: {
        title: 'demo测试'
      }
    },
    {
      path: '/auth',
      component: Auth,
      meta: {
          title: '授权'
      }
    },    {
      path: '/auth2',
      component: Auth2,
      meta: {
        title: '授权'
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/index',
      component: Index,
      meta: {
          title: '首页'
      }
    },
    {
      path: '/items-for',
      component: ItemsFor,
      meta: {
          title: '添加'
      }
    },
    {
      path: '/select-Items',
      component: SelectItems,
      meta: {
          title: '选择物品'
      }
    },
    {
      path: '/goods-outbound',
      component: GoodsOutbound,
      meta: {
          title: '办公用品领用'
      }
    },
    {
      path: '/product-inventory',
      component: ProductInventory,
      meta: {
          title: '产品库存'
      }
    },
    {
      path: '/dealt-done',
      component: DealtDone,
      meta: {
          title: '待办/已办'
      }
    },
    {
      path: '/todo-detail',
      component: TodoDetail,
      meta: {
          title: '待办详情'
      }
    },
    {
      path: '/entry-goods',
      component: EntryGoods,
      meta: {
          title: '新员工入职物质领用'
      }
    },
    {
      path: '/my-apply',
      component: MyApply,
      meta: {
          title: '我的申请'
      }
    },
    {
      path: '/apply-detail',
      component: ApplyDetail,
      meta: {
          title: '申请明细'
      }
    },
    {
      path: '/logout',
      component: Logout,
      meta: {
        title: '退出'
      }
    },
    {
      path: '/apply-history',
      component: ApplyHistory,
      meta: {
        title: '审批历史'
      }
    },
  ]
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router