import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
    this.dataService.getData().then(
      settings => {
        if (settings != null) {
          this.settings = settings;
        }
        this.fetchData();
      }
    );
  }

  fetchData(): void {
    let url = 'https://www.reddit.com/r/' +
      this.settings.subreddit + this.settings.sort +
      '/.json?limit=100';

    if (this.after) {
      url += '&after=' + this.after;
    }

    this.loading = true;

    this.httpClient.get(url).pipe(
      map((res: any) => {
        console.log(res);
        let response = res.data.children;
        let validPosts = 0;

        // Quita todos los posts que no contienen videos

        response = response.filter(
          post => {
            // Si ya hemos sacado suficientes posts, paramos
            if (validPosts >= this.settings.perPage) {
              return false;
            }

            // Solo nos interesan los ficheros .gifv y .webm
            // Los convertimos en mp4
            if (post.data.url.indexOf('.gifv') > -1 ||
              post.data.url.indexOf('.webm') > -1) {
              post.data.url = post.data.url.replace('.gifv', '.mp4');
              post.data.url = post.data.url.replace('.webm', '.mp4');

              // Si hay una preview de la imagen disponible, se asigna al post como 'snapshot'
              if (typeof (post.data.preview) != 'undefined') {
                post.data.snapshot = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');


                // Si el snapshot no está definido, se pone a vacío para que no salga el icono de imagen rota
                if (post.data.snapshot == 'undefined') {
                  post.data.snapshot = '';
                }
              } else {
                post.data.snapshot = '';
              }
              validPosts++;

              return true;

            } else {

              return false;

            }

          });

        // Si tenemos suficientes posts válidos, esos se ponen como el 'after',
        // si no, se pone el último post
        if (validPosts >= this.settings.perPage) {
          this.after = response[this.settings.perPage - 1].data.name;
        } else if (res.data.children.length > 0) {
          this.after = res.data.children[res.data.children.length - 1].data.name;
          console.log(this.after);
        }

        return response;

      })
    ).subscribe(
      data => {
        console.log(data);
        // Se añaden los post que acabamos de coger a los post existentes
        this.posts.push(...data);

        // Seguimos buscando más gifs mientras no rellenemos la página.
        // Desistimos después de 20 intentos aunque no tengamos suficientes.


        if (this.moreCount > 20) {
          console.log('Desistiendo...');
          this.moreCount = 0;
          this.loading = false;
          } else {

            // Si no tenemos suficientes posts para rellenar una página, intentamos coger más datos
            if (this.posts.length < (this.settings.perPage * this.page)){
              this.fetchData();
              this.moreCount++;
            } else {
              this.loading = false;
              this.moreCount = 0;
            }
          }
      }, error => {
        console.log(error);
        // En este caso, el spinner se continúa mostrando
        console.log('No se encuentran datos...');
        }
    );
  }

  nextPage(): void {
    this.page++;
    this.fetchData();
  }

  resetPosts(): void {
    this.page = 1;
    this.posts = [];
    this.after = null;
    this.fetchData();
  }

  changeSubreddit(subreddit): void {
    this.settings.subreddit = subreddit;
    this.resetPosts();
  }
}
