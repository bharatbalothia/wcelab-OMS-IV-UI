import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ShipNode } from '../datatype/ShipNode';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class ShipnodeService {

  constructor() { }
}