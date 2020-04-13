import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Summary } from './dashboard.models';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }


  getTotal():Observable<Summary> {
    return this.http.get<Summary>('https://api.covid19api.com/summary')
  }
  getTrend(slug:string,type:string):Observable<any[]> {
    return this.http.get<any[]>('https://api.covid19api.com/total/dayone/country/'+slug+'/status/'+type+'')
  }
}
