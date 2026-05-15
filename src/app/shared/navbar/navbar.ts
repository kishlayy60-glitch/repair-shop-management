import { Component } from '@angular/core';

import { RouterLink, Router } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar {

  isLoggedIn = false;

  constructor(
    private router: Router
  ) {

    this.checkLogin();

  }



  // =========================
  // CHECK LOGIN
  // =========================

  checkLogin() {

    const login = localStorage.getItem('admin');

    this.isLoggedIn = login === 'true';

  }



  // =========================
  // LOGOUT
  // =========================

  logout() {

    const confirmLogout = confirm(

      'Are you sure you want to logout?'

    );



    if(confirmLogout) {

      localStorage.removeItem('admin');



      this.router.navigate(['/login']);



      setTimeout(() => {

        window.location.reload();

      }, 300);

    }

  }

}
