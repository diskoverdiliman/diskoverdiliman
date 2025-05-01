import { createRouter, createWebHistory } from 'vue-router'

// import views
import HomePage from "@/views/HomePage.vue"

import CategoryTablePage from "@/views/AdminPages/CategoryTablePage.vue"
import TagTablePage from "@/views/AdminPages/TagTablePage.vue"

import CategoryFormPage from "@/views/CategoryFormPage.vue"
import TagFormPage from "@/views/TagFormPage.vue"

import MapPage from "@/views/MapPage/index.vue";

import ResultSide from "@/views/MapPage/ResultSide.vue"
import DetailSide from "@/views/MapPage/DetailSide.vue"
import FaqPage from "@/views/FaqPage.vue"
import Error404Page from "@/views/Error404Page.vue"

import LoginPage from "@/views/LoginPage.vue"
import DummyPage from "@/views/DummyPage.vue"

import AdminPages from "@/views/AdminPages/index.vue"
import LocationImagesFormPage from "@/views/AdminPages/LocationImagesFormPage.vue"
import DeleteImagesFormPage from "@/views/AdminPages/DeleteImagesFormPage.vue"
import LocationCRUDFormPage from "@/views/AdminPages/LocationCRUDFormPage.vue"
import UploadImagesFormPage from "@/views/AdminPages/UploadImagesFormPage.vue"
import UnauthenticatedPage from "@/views/AdminPages/UnauthenticatedPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // home page
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    // map page with search and details page as subpages inside the side drawer
    {
      path: "/map",
      component: MapPage,
      name: "map",
      children: [
        { path: "search", name: "search", component: ResultSide },
        { path: "details/:id?", name: "details", component: DetailSide },
      ]
    },
    // form page for admin
    {
      path: "/admin",
      name: "admin_blank",
      component: AdminPages,
      children: [
        {
          path: "location/form/:mode/:id?",
          name: "location_crud_form",
          component: LocationCRUDFormPage
        },
        {
          path: "location/images/form/:id",
          name: "location_images_form",
          component: LocationImagesFormPage
        },
        {
          path: "images/form/delete",
          name: "delete_images_form",
          component: DeleteImagesFormPage
        },
        {
          path: "images/form/upload",
          name: "upload_images_form",
          component: UploadImagesFormPage
        },
        {
          path: "browse/categories",
          component: CategoryTablePage,
          name: "categorytable"
        },
        {
          path: "browse/tags",
          component: TagTablePage,
          name: "tagtable"
        },
        {
          path: "unauthenticated",
          name: "unauthenticated",
          component: UnauthenticatedPage
        },
        {
          path: "/:pathMatch(.*)*",
          component: Error404Page
        }
      ]
    },    
    // faq page
    {
      path: "/faq",
      name: "faq",
      component: FaqPage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/dummy",
      name: "dummy",
      component: DummyPage
    },
    //category form page
    {
      path: "/categoryform/:mode/:id?",
      name: "categoryform",
      component: CategoryFormPage,
    },
    {
      path: "/tagform/:mode/:id?",
      name: "tagform",
      component: TagFormPage,
    },
    // Error 404 page catches all pages that don't match above routes
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: Error404Page
    },

  ]
})

export default router
