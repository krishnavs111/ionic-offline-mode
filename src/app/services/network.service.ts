/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Capacitor, Plugins } from '@capacitor/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

const { Network } = Plugins;

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
  private loading: any = null;

  constructor(private toastController: ToastController, private loadingCtrl: LoadingController) {
    console.log('NetworkService::constructor | method called');

    let status = ConnectionStatus.Offline;
    if (Capacitor.platform === 'web') {
      console.log('WEB');
      console.log('navigator.onLine', navigator.onLine);
      this.addConnectivityListenersBrowser();
      status = navigator.onLine === true ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.updateNetworkStatus(status);
    } else {
      console.log('NATIVE');
      this.addConnectivityListernerNative();
      status = Network.getStatus();
      this.updateNetworkStatus(status);
    }
  }

  addConnectivityListenersBrowser() {
    window.addEventListener('online', this.onOnline.bind(this));
    window.addEventListener('offline', this.onOffline.bind(this));
  }

  addConnectivityListernerNative() {
    const handler = Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
    });
  }

  onOnline() {
    if (this.status.getValue() === ConnectionStatus.Offline) {
      console.log('Network connected!');
      console.log('navigator.onLine', navigator.onLine);
      this.dismissLoading();
      this.updateNetworkStatus(ConnectionStatus.Online);
    }
  }

  onOffline() {
    if (this.status.getValue() === ConnectionStatus.Online) {
      console.log('Network was disconnected :-(');
      console.log('navigator.onLine', navigator.onLine);
      this.presentLoading();
      this.updateNetworkStatus(ConnectionStatus.Offline);
    }
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    console.log('updateNetworkStatus', status);
    this.status.next(status);

    const connection = status === ConnectionStatus.Offline ? 'Offline' : 'Online';
    const toast = await this.toastController.create({
      message: `You are now ${connection}`,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  private async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Waiting for connection...',
    });

    return await this.loading.present();
  }

  private async dismissLoading() {
    if ((this.loading !== null) && (typeof this.loading !== 'undefined')) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

}
