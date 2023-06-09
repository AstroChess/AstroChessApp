import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: any = null;

    constructor(private http: HttpClient){}

    login(url: string, userObject: Object): Observable<AuthLoginResponse>{
        return this.http.post<AuthLoginResponse>(url, userObject);
    }
}

interface AuthLoginResponse {
  status: string,
  message: string
}