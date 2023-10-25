import { Component, OnInit } from '@angular/core';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';



  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.login(this.email, this.password).subscribe(
      response => {
        // Redirigir a la página de inicio del usuario
      },
      error => {
        console.log(error);
        // Mostrar mensaje de error al usuario
      }
    );
  }

}
