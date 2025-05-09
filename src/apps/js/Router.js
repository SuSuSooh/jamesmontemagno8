/*
 * 	This file is part of ELCube.
 *	ELCube is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCube is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
 */
import AuthUtils from "./AuthUtils"
import NkLayout from "../NkLayout";
import NkNotFound from "../NkNotFound";
import NkMe from "../NkMe";
import NkAbout from "../NkAbout";
import NkApi from "../NkApi";
import StateUI from "../stores/StateUI";

export default function(VueRouter,moduleRoutes,loginPage,defaultPage) {

    let routes = [
      {
        path: '*',
        redirect: '/apps/notfound'
      },
      {
        path: '/',
        component: loginPage,
        meta: {
          title: '登陆',
          ignoreAuth : true
        }
      },
      {
        name: '首页',
        path: '/apps',
        component: NkLayout,
        redirect: '/apps/default',
        children:[
          {
            name: '欢迎页',
            path: '/apps/default',
            component: defaultPage,
            closable :false,
            meta: {
              title: '欢迎页'
            },
          },
          {
            name: '关于',
            path: '/apps/about',
            component: NkAbout,
            closable :false,
            meta: {
              title: '关于ELCube'
            },
          },
          {
            name: '个人中心',
            path: '/apps/me',
            component: NkMe,
            meta: {
              title: '个人中心'
            },
          },
          {
            name: '页面没有找到',
            path: 'notfound',
            component: NkNotFound,
            meta: {
              title: '页面没有找到'
            },
          },
          {
            name: 'Api 文档',
            path: 'apidoc',
            component: NkApi,
            meta: {
              title: 'Api 文档'
            }
          },
          ...moduleRoutes
        ]
      }
    ];

    const router = new VueRouter({
      mode: 'hash',
      base: '/',
      routes,
      scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
      }
    });

    function updateMeta(to){
      let title = (to.meta&&to.meta.title)||to.name;
      if (title) {
        document.title = title + '-' + StateUI.state.appName;
      }
    }

    router.beforeEach((to, from, next) => {
      let state = AuthUtils.state();
      if(state.authed){
        // 如果用户已登陆
        if(to.path==='/'){
          next({
            path: '/apps'
          })
        }else{
          next();
          updateMeta(to);
        }
      }else{
        // 如果用户未登陆
        if (to.meta.ignoreAuth){
          // 跳转到登陆
          next();
          updateMeta(to);
        }else if(from.path==='/'){
          console.log(from.path)
          console.log(to.path)
          next({path: '/?redirect='+to.path})
        }else{
          router.app.$http.reLogin(()=>{
            next();
            updateMeta(to);
          })
        }
      }
    });

    return router;
  }



