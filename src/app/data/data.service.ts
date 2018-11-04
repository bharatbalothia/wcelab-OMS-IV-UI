import {Injectable} from '@angular/core';
import {ShipNode} from '../datatype/ShipNode';
import {Observable, of} from 'rxjs';

@Injectable()
export class DataService {

  private ELEMENT_DATA: ShipNode[] = [
    {"shipNode": "latest_madrid_dc",
    "latitude": 25.8867881,
    "longitude": -25.972472},
    { "shipNode": "nztest_dallas_dc",
    "latitude": 32.8867881,
    "longitude": -96.972472},
    { "shipNode": "nztest_littleton_dc",
    "latitude": 42.5492895,
    "longitude": -71.4723905},
  ];
  
  private categories = [
    {value: 'Web-Development', viewValue: 'Web Development'},
    {value: 'Android-Development', viewValue: 'Android Development'},
    {value: 'IOS-Development', viewValue: 'IOS Development'}
  ];


  constructor() {
  }

  getData(): Observable<ShipNode[]> {
    return of<ShipNode[]>(this.ELEMENT_DATA);
  }

  addShipnode(data) {
    this.ELEMENT_DATA.push(data);
  }

  deleteShipnode(shipNode) {

    const index = this.ELEMENT_DATA.indexOf(shipNode, 0);

    if (index > -1) {
      this.ELEMENT_DATA = [...this.ELEMENT_DATA.slice(0, index), ...this.ELEMENT_DATA.slice(index + 1)];
    }
  }

  dataLength() {
    return this.ELEMENT_DATA.length;
  }
}