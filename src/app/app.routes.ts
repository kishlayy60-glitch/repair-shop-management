import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  // =====================================
  // HOME PAGE
  // CUSTOMER STATUS CHECK
  // =====================================

  {
    path: '',
    loadComponent: () =>
      import('./pages/receipt-status/receipt-status')
      .then((m) => m.ReceiptStatus)
  },



  // =====================================
  // SECRET ADMIN LOGIN PAGE
  // =====================================

  {
    path: 'sonam-admin-2026',

    loadComponent: () =>
      import('./pages/login/login')
      .then((m) => m.Login)
  },



  // =====================================
  // DASHBOARD PAGE
  // =====================================

  {
    path: 'dashboard',

    loadComponent: () =>
      import('./pages/dashboard/dashboard')
      .then((m) => m.Dashboard),

    canActivate: [authGuard]
  },



  // =====================================
  // ADD RECEIPT PAGE
  // =====================================

  {
    path: 'add-receipt',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/add-receipt/add-receipt')
      .then((m) => m.AddReceiptComponent)
  },



  // =====================================
  // UPDATE STATUS PAGE
  // =====================================

  {
    path: 'update-status',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./pages/update-status/update-status')
      .then((m) => m.UpdateStatus)
  },



  // =====================================
  // INVALID ROUTE REDIRECT
  // =====================================

  {
    path: '**',
    redirectTo: ''
  }

];
