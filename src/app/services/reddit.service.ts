import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RedditService {

  public settings = {
    perPage: 10,
    subreddit: 'gifs',
    sort: '/hot'
  };

  public posts: any[] = [];
  
  public loading: boolean = false;
  private page: number = 1;
  private after: string;
  private moreCount: number = 0;

  constructor(
    private httpClient: HttpClient,
    private dataService: DataService
  ) { }

  load(): void {
  }

  fetchData(): void {
  }

  nextPage(): void {
  }

  resetPosts(): void {
  }

  changeSubreddit(subreddit): void {
  }
}
