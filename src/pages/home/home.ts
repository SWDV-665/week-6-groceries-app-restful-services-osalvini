import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Subscription } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnDestroy {

  title = "Grocery";
  items = [];
  errorMessage: string;
  dataChangedSubscription: Subscription;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public dataService: GroceriesServiceProvider, public inputDialogService: InputDialogServiceProvider, public socialSharing: SocialSharing) {
    this.dataChangedSubscription = dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      if(dataChanged){
        console.log('data changed');
        this.loadItems();
      }else{
        console.log('data did NOT change');
      }
    })
  }

  ngOnDestroy() {
    if (this.dataChangedSubscription) {
      this.dataChangedSubscription.unsubscribe();
    }
  }

  ionViewDidLoad() {
    this.loadItems()
  }

  ionViewDidLeave() {
    if(this.dataChangedSubscription) {
      this.dataChangedSubscription.unsubscribe();
    }
  }

  loadItems() {
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any> error,
      )
  }

  removeItem(id) {
    this.dataService.removeItem(id);
  }

  shareItem(item, index) {
    console.log("sharing item: ", item, index)
    const toast = this.toastCtrl.create({
      message: "sharing item: " + index + " ...",
      duration: 3000
    });
    toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {
      console.log("Shared Successfully");
    }).catch((error) => {
      console.log("Error while sharing", error);
    });
  }

  editItem(item, index) {
    console.log("removing item: ", item, index)
    const toast = this.toastCtrl.create({
      message: "editing item: " + index + " ...",
      duration: 3000
    });
    toast.present();
    this.inputDialogService.showPrompt(item, index);
  }
  addItem() {
    console.log("adding item")
    this.inputDialogService.showPrompt()
  }

}
