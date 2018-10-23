import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage: Storage) { }

  getData(): Promise<any> {
    return this.storage.get('settings');
  }

  saveData(data): void {
    this.storage.set('settings', data);
  }
}
