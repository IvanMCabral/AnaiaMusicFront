import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { UserResponse } from '../interfaces/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  createUser(user: User) {
    const params = new HttpParams()
      .set('firstName', user.firstName)
      .set('lastName', user.lastName)
      .set('email', user.email)
      .set('password', user.password);

    const options = { params };

    return this.http.post<User>(this.url +"/register", {}, options);
  }


  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<UserResponse>(this.url + "/login", body);
  }

 

}
