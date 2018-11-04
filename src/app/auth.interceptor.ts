import { Injectable } from '@angular/core';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

// import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private bearerTokens = {
        configuration_shipnodes: "UhWkb0mO3iyy9GHkI3WyMVHJkE3Cx2o7",
    };

    private getToken(request: HttpRequest<any>) : string {

        // console.log(request.url);
        if (request.url.includes("configuration/shipNodes")) {
            return this.bearerTokens.configuration_shipnodes;
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        req = req.clone({
            setHeaders: {
            'Content-Type' : 'application/json; charset=utf-8',
            'Accept'       : 'application/json',
            'Authorization': `Bearer ${this.getToken(req)}`,
            },
        });

        return next.handle(req);

    }
}