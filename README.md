
**Ionic Storage**

**Installation**

      npm install @ionic/storage

If using Angular, install the @ionic/storage-angular library instead:

      npm install @ionic/storage-angular
      
**Usage**

**With Angular**

Usage in Angular using Services and Dependency Injection requires importing the IonicStorageModule and then injecting the Storage class.

First, edit your NgModule declaration in src/app/app.module.ts or in the module for the component you'll use the storage library in, and add IonicStorageModule as an import:

      import { IonicStorageModule } from '@ionic/storage-angular';

      @NgModule({
      imports: [
      IonicStorageModule.forRoot()
        ]
      })
      export class AppModule { }
      
      
Next, inject Storage into a component. Note: this approach is meant for usage in a single component (such as AppComponent). In this case, create() should only be called once. For use in multiple components, we recommend creating a service (see next example).

     import { Component } from '@angular/core';
     import { Storage } from '@ionic/storage-angular';

        @Component({
          selector: 'app-root',
          templateUrl: 'app.component.html'
        })
        export class AppComponent {

          constructor(private storage: Storage) {
          }

          async ngOnInit() {
            // If using a custom driver:
            // await this.storage.defineDriver(MyCustomDriver)
            await this.storage.create();
          }
        }
For more sophisticated usage, an Angular Service should be created to manage all database operations in your app and constrain all configuration and database initialization to a single location. When doing this, don't forget to register this service in a providers array in your NgModule if not using providedIn: 'root', and ensure that the IonicStorageModule has been initialized in that NgModule as shown above. Here's an example of what this service might look like:

      import { Injectable } from '@angular/core';

      import { Storage } from '@ionic/storage-angular';

      @Injectable({
        providedIn: 'root'
      })
      export class StorageService {
        private _storage: Storage | null = null;

        constructor(private storage: Storage) {
          this.init();
        }

        async init() {
          // If using, define drivers here: await this.storage.defineDriver(/*...*/);
          const storage = await this.storage.create();
          this._storage = storage;
        }

        // Create and expose methods that users of this service can
        // call, for example:
        public set(key: string, value: any) {
          this._storage?.set(key, value);
        }
      }
Then, inject the StorageService into your pages and other components that need to interface with the Storage engine.


**API**

The Storage API provides ways to set, get, and remove a value associated with a key, along with clearing the database, accessing the stored keys and their quantity, and enumerating the values in the database.

To set an item, use       set(key, value):

    await storage.set('name', 'Mr. Ionitron');
To get the item back, use get(name):

    const name = await storage.get('name');
To remove an item:

    await storage.remove(key);
To clear all items:

    await storage.clear();
To get all keys stored:

    await storage.keys()
To get the quantity of key/value pairs stored:

    await storage.length()
To enumerate the stored key/value pairs:

    storage.forEach((key, value, index) => {
    });
To enable encryption when using the Ionic Secure Storage driver:

      storage.setEncryptionKey('mykey');
See Encryption Support below for more information.

**Configuration**

**Angular configuration**

       import { Drivers, Storage } from '@ionic/storage';
       import { IonicStorageModule } from '@ionic/storage-angular';

      @NgModule({
        //...
        imports: [
         IonicStorageModule.forRoot({
           name: '__mydb',
           driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
         })
       ],
       //...
      })
      export class AppModule { }
