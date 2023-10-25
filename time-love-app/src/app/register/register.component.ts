import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../user-service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = {
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  };

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.userService.createUser(this.user).subscribe(
      user => {
        console.log("Usuario creado exitosamente");
        this.router.navigate(['/login']);
      },
      error => {
        console.error("Error al crear usuario: ", error);
      }
    );
  }

}
