/* eslint-disable object-shorthand */
// /* eslint-disable object-shorthand */
 import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUserModalComponent } from '../modals/add.user.modal';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

   users = [];

  constructor(private networkService: NetworkService, private apiService: ApiService, private modalCtrl: ModalController) {
    console.log('HomePage::constructor() | method called');
    this.loadData(true);
  }

  loadData(refresh = false, refresher?) {
    this.apiService.getUsers(refresh).subscribe(res => {
      this.users = res;
      if (refresher) {
        refresher.target.complete();
      }
    });
  }

  async presentModal() {
    console.log('HomePage::presentModal | method called');
    const componentProps = { modalProps: { title: 'Add User Modal', buttonText: 'Add'}};
    const modal = await this.modalCtrl.create({
      component: AddUserModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

 }
