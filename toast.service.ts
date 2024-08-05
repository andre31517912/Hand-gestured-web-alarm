import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() {}

  showToast(message: string) {
    console.log('showToast called with message:', message);
    alert(message);
  }
}