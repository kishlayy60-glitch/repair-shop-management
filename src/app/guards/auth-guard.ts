import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  // CHECK LOGIN

  const isLoggedIn = localStorage.getItem('admin');

  // IF LOGGED IN

  if (isLoggedIn) {

    return true;

  }

  // IF NOT LOGGED IN

  else {

    router.navigate(['/sonam-admin-2026']);

    return false;

  }

};
