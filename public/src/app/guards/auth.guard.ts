import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpService } from '../http.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        public _httpService: HttpService
    ) { }

    canActivate(): boolean {
        if (!this._httpService.isAuthenticated()) {
            this._router.navigate(['/signin']);
            return false;
        }
        return true;
    }
}