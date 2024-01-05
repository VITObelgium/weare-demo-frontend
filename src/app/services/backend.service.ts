import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { serializeDatasetAsTurtle } from '@weare/weare-libs';
import { Store } from 'n3';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  getPods(): Observable<string[]> {
    return this.http.get(environment.backend_base + environment.backend_get_pods, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(map(res => {
      return JSON.parse(res)
    }))
  }

  getResource(relativeResourceUrl: string): Observable<string> {
    return this.http.get(environment.backend_base + environment.backend_read, {
      params: {
        relativeResourceUrl: relativeResourceUrl
      },
      withCredentials: true,
      responseType: 'text'
    })
  }

  
  async writeResource(relativeResourceUrl: string, dataset: Store):  Promise<Observable<object>> {
 
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8').set('Accept', 'text/plain; charset=utf-8');
    const httpOptions = {
      withCredentials: true,
      headers,
      params: {
        relativeResourceUrl: relativeResourceUrl
      }
    };

    // We don't know the logged-in user's WebID, let alone the Pod they wish
    // to store their data, so we can't know the final resource IRI...
    console.log("Serializing resource...");
    const turtle = await serializeDatasetAsTurtle(dataset);

    console.log(turtle);
    return await this.http.post(environment.backend_base + environment.backend_write, turtle, httpOptions);

  }

  shareResource(podRelativeUrl: string): void {
    const redirectUrl = environment.frontend_base;

    window.document.location.href = environment.backend_base + environment.backend_access_request
      + '?redirectUrl=' + encodeURIComponent(redirectUrl)
      + '&podRelativeUrl=' + encodeURIComponent(podRelativeUrl);
  }

}
