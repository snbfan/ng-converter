import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  private namespacePrefix = 'ng-converter-app:';

  getItem(key: string): any {
    try {
      const storageKey = this.getNamespacedKey(key);
      return JSON.parse(sessionStorage.getItem(storageKey));
    } catch (err) {
      return null;
    }
  }

  setItem(key: string, value: any): void {
    const storageKey = this.getNamespacedKey(key);
    const storageValue = JSON.stringify(value);
    sessionStorage.setItem(storageKey, storageValue);
  }

  getNamespacedKey(key: string): string {
    return this.namespacePrefix + key;
  }
}
