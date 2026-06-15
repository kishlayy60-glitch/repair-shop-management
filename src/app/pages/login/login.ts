import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  email = '';

  password = '';

  loading = false;

  constructor(
    private router: Router
  ) {}

  // =========================
  // LOGIN FUNCTION
  // =========================

  login() {

    this.loading = true;

    // ADMIN LOGIN

    if (
      this.email === 'admin@gmail.com'
      &&
      this.password === '1234'
    ) {

      // SAVE LOGIN SESSION

      localStorage.setItem('admin', 'true');

      alert('Login Successful');

      // REDIRECT

      this.router.navigate(['/add-receipt']);

      // REFRESH NAVBAR

      setTimeout(() => {
        window.location.reload();
      }, 500);

    }
    else {

      alert('Invalid Email or Password');

    }

    this.loading = false;

  }

}
