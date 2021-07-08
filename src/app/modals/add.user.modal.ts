import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import { v4 as uuid } from 'uuid';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: 'add.user.modal.html',
  styleUrls: ['./add.user.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserModalComponent implements OnInit {

  modal: any = {
    title: '',
    buttonText: ''
  };

  addUserForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private modalCtrl: ModalController, public navParams: NavParams,
              private apiService: ApiService) {
    this.createForm();
  }

  createForm() {
    this.addUserForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    this.modal = { ...this.navParams.data.modalProps};
  }

  dismiss(data?: any) {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss(data);
  }

  addUserFormSubmit() {
    console.log('AddUserModalComponent::addUserFormSubmit() | method called');
    this.addUserForm.value.id = uuid();
    console.log(this.addUserForm.value);
    this.apiService.addUser(this.addUserForm.value).subscribe(res => {
      console.log('Added User', res);
      this.dismiss();
    });
  }

  clearAddUserForm() {
    console.log('AddUserModalComponent::clearAddUserForm() | method called');
    this.addUserForm.reset();
  }

}
