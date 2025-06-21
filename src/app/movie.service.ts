import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { environment } from '../environment';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { MoviesApiResponse } from './movie/movie.component';


export interface Movie {
  id: number;
  title: string;
  backdrop_path?: string;
  release_date: string;
  original_title: string;

}

export interface MoviesResponse {
  results: Movie[];
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private http = inject(HttpClient);
  private apiKey = environment.movieApiKey;
  private baseUrl = 'https://api.themoviedb.org/3';



  getMovies(query: string, sortBy: string) :Observable<MoviesApiResponse>{
    let url = '';
    let params = new HttpParams().set('api_key', this.apiKey);
  
    if (query) {
      url = `${this.baseUrl}/search/movie`;
      params = params.set('query', query);
    } else {
      url = `${this.baseUrl}/discover/movie`;
      params = params.set('sort_by', sortBy);
    }
  
  return this.http.get<MoviesApiResponse>(url, { params });
  }
  // private injector = inject(EnvironmentInjector);

  //  getMovies(query: string, sortBy: string) {
  //   return runInInjectionContext(this.injector, () => {
  //     let url = '';
  //     let params = new HttpParams().set('api_key', this.apiKey);

  //     if (query) {
  //       url = `${this.baseUrl}/search/movie`;
  //       params = params.set('query', query);
  //     } else {
  //       url = `${this.baseUrl}/discover/movie`;
  //       params = params.set('sort_by', sortBy);
  //     }

  //     return toSignal(
  //       this.http.get<MoviesResponse>(url, { params }),
  //       { initialValue: { results: [] } }
  //     );
  //   });
  // }

  
}
