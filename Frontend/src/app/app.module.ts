import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';

import { AuthService } from './Services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserHomeComponent } from './Components/users/user-home/user-home.component';
import { UserProductsComponent } from './Components/users/user-products/user-products.component';
import { UserShopCartComponent } from './Components/users/user-shop-cart/user-shop-cart.component';
import { UserProfileComponent } from './Components/users/user-profile/user-profile.component';
import { UserOrdersComponent } from './Components/users/user-orders/user-orders.component';

import { AdminUsersComponent } from './Components/admin/admin-users/admin-users.component';
import { AdminProductsComponent } from './Components/admin/admin-products/admin-products.component';
import { AdminCategoriesComponent } from './Components/admin/admin-categories/admin-categories.component';
import { AdminRolsComponent } from './Components/admin/admin-rols/admin-rols.component';
import { AdminAdminsComponent } from './Components/admin/admin-admins/admin-admins.component';

import { AuthLoginComponent } from './Components/auth/auth-login/auth-login.component';
import { AuthSignUpComponent } from './Components/auth/auth-sign-up/auth-sign-up.component';

import { NavUsersComponent } from './Components/navigation/nav-users/nav-users.component';
import { NavAdminComponent } from './Components/navigation/nav-admin/nav-admin.component';

import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { AdminOrdersComponent } from './Components/admin/admin-orders/admin-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    UserHomeComponent,
    UserProductsComponent,
    UserShopCartComponent,
    UserProfileComponent,
    AdminUsersComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminRolsComponent,
    AuthLoginComponent,
    AuthSignUpComponent,
    NavUsersComponent,
    NavAdminComponent,
    AdminAdminsComponent,
    UserOrdersComponent,
    AdminOrdersComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],

  providers: [JwtHelperService],
  bootstrap: [AppComponent],
})
export class AppModule {}
