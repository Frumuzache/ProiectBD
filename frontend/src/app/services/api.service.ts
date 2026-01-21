import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // III.a & III.b: Metode generice pentru CRUD
  getData(path: string, sort?: string): Observable<any[]> {
    const sortParam = sort ? `?sortBy=${sort}` : '';
    return this.http.get<any[]>(`${this.url}/${path}${sortParam}`);
  }

  delete(path: string, id: number): Observable<any> {
    return this.http.delete(`${this.url}/${path}/${id}`);
  }

  update(path: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.url}/${path}/${id}`, data);
  }

  getList(entity: string, sortBy?: string): Observable<any[]> {
    const params = sortBy ? `?sortBy=${sortBy}` : '';
    return this.http.get<any[]>(`${this.url}/${entity}${params}`);
  }

  // III.c, d, f: Metode pentru cerințe speciale
  private noCacheHeaders = new HttpHeaders({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0'
  });

  getDetailedOrders(status?: string, minRating?: number): Observable<any[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (minRating !== undefined && minRating !== null) params = params.set('minRating', minRating.toString());
    const ts = Date.now();
    params = params.set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/Comenzi/detailed`, { headers: this.noCacheHeaders, params });
  }

  getRestaurantStats(minProducts?: number): Observable<any[]> {
    let params = new HttpParams();
    if (minProducts !== undefined && minProducts !== null) {
      params = params.set('minProducts', minProducts.toString());
    }
    const ts = Date.now();
    params = params.set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/Restaurante/stats`, { headers: this.noCacheHeaders, params });
  }
  getComplexView(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.url}/views/complex`); 
  }

  // III.e: Cascade deletion demonstration
  getOrders(): Observable<any[]> {
    const ts = Date.now();
    const params = new HttpParams().set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/Comenzi`, { headers: this.noCacheHeaders, params });
  }

  getReports(): Observable<any[]> {
    const ts = Date.now();
    const params = new HttpParams().set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/Raportari`, { headers: this.noCacheHeaders, params });
  }

  getPayments(): Observable<any[]> {
    const ts = Date.now();
    const params = new HttpParams().set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/PLati`, { headers: this.noCacheHeaders, params });
  }

  getOrderItems(): Observable<any[]> {
    const ts = Date.now();
    const params = new HttpParams().set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/produse-comanda`, { headers: this.noCacheHeaders, params });
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Comenzi/${id}`);
  }

  // III.f: Metode pentru vizualizări (Views)
  getViewsSimple(): Observable<any[]> {
    const ts = Date.now();
    const params = new HttpParams().set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/views/simple`, { headers: this.noCacheHeaders, params });
  }

  getViewsComplex(): Observable<any[]> {
    const ts = Date.now();
    const params = new HttpParams().set('_t', ts.toString());
    return this.http.get<any[]>(`${this.url}/views/complex`, { headers: this.noCacheHeaders, params });
  }

  updateViewStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.url}/views/simple/${id}`, { status });
  }

  deleteViewSimple(id: number): Observable<any> {
    return this.http.delete(`${this.url}/views/simple/${id}`);
  }
}