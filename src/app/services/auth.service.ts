import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthData } from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuth$ = new BehaviorSubject<boolean>(false);
  private userId$ = new BehaviorSubject<string>(null);

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
      .then(() => {
        this.router.navigate(['/login']);
      })
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
      .then((data) => {
        this.userId$.next(data.user.uid);
        this.router.navigate(['/home']);
        this.isAuth$.next(true);
      })
      .catch((err) => {
        this.presentToast(err);
      });
  }

  /**
   * Method to get the status of auth.
   *
   * @returns boolean
   */

  getAuthStatus(): boolean {
    return this.isAuth$.value;
  }

  /**
   * Method to get user data
   *
   * @returns string
   */

  getUserId(): string {
    return this.userId$.value;
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
