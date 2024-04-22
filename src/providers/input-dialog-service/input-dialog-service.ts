import { Injectable } from '@angular/core';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { AlertController } from 'ionic-angular';


/*
  Generated class for the InputDialogServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class InputDialogServiceProvider {

  constructor(public alertCtrl: AlertController, public dataService: GroceriesServiceProvider) {
    console.log('Hello InputDialogServiceProvider Provider');
  }

  showPrompt(item?, index?) {
    const prompt = this.alertCtrl.create({
      title: item ? 'Edit Item': 'Add Item',
      message: item ? "Please edit item...": "Please enter item...",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          value: item ? item.name: null
        },
        {
          name: 'quantity',
          placeholder: 'Quantity',
          value: item ? item.quantity: null
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log("cancelled");
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log("Saved clicked", data);
            const newItem = { ...item, ...data}
            if (index !== undefined) {
              this.dataService.editItem(newItem, index);
            }
            else {
              this.dataService.addItem(newItem);
            }

          },
        }
      ]
    });
    prompt.present();
  }
}
