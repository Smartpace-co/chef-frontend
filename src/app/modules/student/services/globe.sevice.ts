import { Injectable } from '@angular/core';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import countriesNames from './countres-list';

const Path_World = 'assets/world1.json';


@Injectable({
  providedIn: 'root'
})
export class GlobeService {
  constructor() {}

  getCountriesList() {
    return countriesNames;
  }

  getWorldData(): Observable<any> {
    return new Observable((observer) => {
      d3.json(Path_World)
        .then((res) => {
          observer.next(res);
        })
        .catch((err) => observer.error(err));
    });
  }
}
