import Vue from 'vue'
import Router from 'vue-router'
// 物品申请
import ItemsFor from '@/components/items-for.vue'
// 选择物品
import SelectItems from '@/components/select-items.vue'
// 物品出库
import GoodsOutbound from '@/components/goods-outbound.vue'
// 产品库存
import ProductInventory from '@/components/product-inventory.vue'
Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/product-inventory'
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
    }
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