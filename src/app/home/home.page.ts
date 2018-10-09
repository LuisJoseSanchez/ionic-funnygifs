import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../services/data.service';
import { RedditService } from '../services/reddit.service';
import { ModalController } from '@ionic/angular';

// Estas importaciones se usan más tarde
import { Plugins } from '@capacitor/core';
import { SettingsPage } from '../settings/settings.page';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
const { Browser, Keyboard } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public subredditForm: FormGroup;

  constructor(
    private dataService: DataService,
    public redditService: RedditService,
    private modalController: ModalController) {

      this.subredditForm = new FormGroup({
        subredditControl: new FormControl('')
      });
  }

  ngOnInit() {
    this.redditService.load();

    this.subredditForm.get('subredditControl').valueChanges.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
    ).subscribe((subreddit: any) => {
      if (subreddit.length > 0) {
        this.redditService.changeSubreddit(subreddit);
        Keyboard.hide().catch((err) => {
          console.warn(err);
        });
      }
    });
  }

  showComments(post): void { }

  openSettings(): void { }

  playVideo(e, post): void { }

  loadMore(): void { }
}
