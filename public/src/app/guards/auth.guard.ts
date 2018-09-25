import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpService } from '../http.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        public _httpService: HttpService
    ) {
        console.log('Auth Guard');
    }

    canActivate(): boolean {
        if (!this._httpService.isAuthenticated()) {
            this._router.navigate(['/signin']);
            console.log("false here!!!");
            return false;
        }
        return true;
    }

    // canActivate(): boolean {
    //     if (!this._httpService.checkStatus()) {
    //         this._router.navigate(['/signin']);
    //         console.log("false here!!!");
    //         return false;
    //     }
    //     return true;
    // }

}