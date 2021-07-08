/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConnectionStatus, NetworkService } from './network.service';
import { OfflineManagerService } from './offline-manager.service';
import { HttpClient } from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const API_STORAGE_KEY = 'specialkey';
const API_URL = 'https://60e292559103bd0017b47420.mockapi.io/api/profile/1';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  strg: Storage | null = null;

  constructor(private networkService: NetworkService, private http: HttpClient, private storage: Storage,
    private offlineManager: OfflineManagerService) {
      this.init();
     }

     async init() {
      // If using, define drivers here: await this.storage.defineDriver(/*...*/);
      const storage = await this.storage.create();
      this.strg = storage;
      console.log('popopopo',this.strg);
    }

    getUsers(forceRefresh: boolean = false): Observable<any[]> {
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline || !forceRefresh) {
        // Return the cached data from Storage
        return from(this.getLocalData('users'));
      } else {
        // Return real API data and store it locally
        return this.http.get<any[]>(`${API_URL}/users`).pipe(
          tap(res => {
            console.log('res', res);
            this.setLocalData('users', res);
          }),
          catchError((x, caught) => {
            return throwError(x);
        }),
        );
      }
    }

    addUser(data): Observable<any> {
      const url = `${API_URL}/users/`;
      if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
        return from(this.offlineManager.storeRequest(url, 'POST', data));
      } else {
        return this.http.post(url, data).pipe(
          catchError(err => {
            this.offlineManager.storeRequest(url, 'POST', data);
            throw new Error(err);
          })
        );
      }
    }

    // Save result of API requests
    private setLocalData(key, data) {
      console.log('ApiService::setLocalData(key, data) | method called', key, data);
      // this.storage.ready().then(() => {
        this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
      // });
    }

    // Get cached API result
    private getLocalData(key) {
      console.log('ApiService::getLocalData(key) | method called', key);
      return this.storage.get(`${API_STORAGE_KEY}-${key}`);
    }
}
