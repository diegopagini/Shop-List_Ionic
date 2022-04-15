import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthData } from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController
  ) {}

  /**
   * Register method.
   *
   * @param {AuthData} authData
   */

  register(authData: AuthData): void {
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => {})
      .catch((err) => {
        this.presentToast(err);
      });
  }

  /**
   * Login method.
   *
   * @param {AuthData} authData
   */

  login(authData: AuthData): void {
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        this.presentToast(err);
      });
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      animated: true,
    });
    toast.present();
  }
}
