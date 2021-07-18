import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../app/config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { CleinteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteSerive: CleinteService) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if( localUser && localUser.email) {
      this.clienteSerive.findByEmail(localUser.email)
        .subscribe(response => {
          this.cliente = response;
          this.getImageIfExists();
        }, 
        error => {
          if(error.status == 403){
            this.navCtrl.setRoot('HomePage');
          }
        })      
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.clienteSerive.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`
      }, 
      error => {});
  }

}
