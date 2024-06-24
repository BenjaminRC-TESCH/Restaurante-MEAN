// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './Components/users/user-home/user-home.component';
import { UserProductsComponent } from './Components/users/user-products/user-products.component';
import { UserProfileComponent } from './Components/users/user-profile/user-profile.component';
import { UserShopCartComponent } from './Components/users/user-shop-cart/user-shop-cart.component';
import { UserOrdersComponent } from './Components/users/user-orders/user-orders.component';

import { AdminUsersComponent } from './Components/admin/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './Components/admin/admin-categories/admin-categories.component';
import { AdminProductsComponent } from './Components/admin/admin-products/admin-products.component';
import { AdminRolsComponent } from './Components/admin/admin-rols/admin-rols.component';
import { AdminAdminsComponent } from './Components/admin/admin-admins/admin-admins.component';
import { AdminOrdersComponent } from './Components/admin/admin-orders/admin-orders.component';

import { AuthLoginComponent } from './Components/auth/auth-login/auth-login.component';
import { AuthSignUpComponent } from './Components/auth/auth-sign-up/auth-sign-up.component';
import { adminGuard } from './Guards/admin-guard.guard';
import { userGuard } from './Guards/user-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: UserHomeComponent,
  },
  {
    path: 'login',
    component: AuthLoginComponent,
  },
  {
    path: 'registro',
    component: AuthSignUpComponent,
  },
  /* Rutas para el usuario */
  {
    path: 'productos',
    component: UserProductsComponent,
    //canActivate: [userGuard],
  },
  {
    path: 'carrito',
    component: UserShopCartComponent,
    canActivate: [userGuard],
  },
  {
    path: 'perfil-usuario',
    component: UserProfileComponent,
    canActivate: [userGuard],
  },
  {
    path: 'pedidos',
    component: UserOrdersComponent,
    canActivate: [userGuard],
  },
  /* Rutas para el administrador */
  {
    path: 'admin-users',
    component: AdminUsersComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin-administrators',
    component: AdminAdminsComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin-categories',
    component: AdminCategoriesComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin-products',
    component: AdminProductsComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin-rols',
    component: AdminRolsComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'admin-orders',
    component: AdminOrdersComponent,
    canActivate: [adminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
