import { Component, computed, inject, Injector, signal } from '@angular/core';
import { MovieService,  } from '../movie.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Movie {
  id: number;
  title: string;
  backdrop_path?: string;
  release_date: string;
  original_title: string;
}

export interface MoviesApiResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}



@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})

export class MovieComponent {
    http = inject(HttpClient);
    private movieService = inject(MovieService);
    injector = inject(Injector);


  searchTerm = signal<string>('');
  selectedSort = signal<string>('popularity.desc');
fetchMovies = signal<Movie[]>([]);
  themeMode = signal<'light' | 'dark'>('dark');
   themeClass = computed(() => `${this.themeMode()}-theme`);

   currentPage = signal(1);
   itemsPerPage = signal(12);



  sortOptions = [
    { label: 'Popularity Descending', value: 'popularity.desc' },
    { label: 'Popularity Ascending', value: 'popularity.asc' },
    { label: 'Rating Descending', value: 'vote_average.desc' },
    { label: 'Rating Ascending', value: 'vote_average.asc' },
    { label: 'Release Date Descending', value: 'release_date.desc' },
    { label: 'Release Date Ascending', value: 'release_date.asc' },
  ];

  movieParams = computed(() => ({
    query: this.searchTerm().trim(),
    sortBy: this.selectedSort(),
  }));

    ngOnInit() {
    this.getMovies();
    this.paginatedMovies();
  }


  
getMovies() {
  const { query, sortBy } = this.movieParams();
  this.movieService.getMovies(query, sortBy).subscribe((data) => {
    this.fetchMovies.set(data.results);

  });
      this.currentPage.set(1)
}




  onSearchChange(event: Event) {
  this.searchTerm.set((event.target as HTMLInputElement).value);
  this.getMovies();
}

onSortChange(event: Event) {
  this.selectedSort.set((event.target as HTMLSelectElement).value);
  this.getMovies();
}

  toggleTheme() {
  this.themeMode.update(mode => mode === 'dark' ? 'light' : 'dark');
}

paginatedMovies = computed(() => {
  const start = (this.currentPage() - 1) * this.itemsPerPage();
  const end = start + this.itemsPerPage();
   const data = this.fetchMovies().slice(start, end);
  return data;
});


totalPages = computed(() =>
Math.ceil(this.fetchMovies().length / this.itemsPerPage())
);

goToPage(page: number) {
  this.currentPage.set(page);
}

get pages() {
  return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
}



}
 
