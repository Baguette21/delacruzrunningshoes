import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<ModalConfig | null>();
  public modal$ = this.modalSubject.asObservable();

  private confirmResolve?: (value: boolean) => void;

  show(config: ModalConfig): void {
    this.modalSubject.next(config);
  }

  alert(message: string, title?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this.show({ message, title, type });
  }

  success(message: string, title: string = 'Success'): void {
    this.show({ message, title, type: 'success' });
  }

  error(message: string, title: string = 'Error'): void {
    this.show({ message, title, type: 'error' });
  }

  warning(message: string, title: string = 'Warning'): void {
    this.show({ message, title, type: 'warning' });
  }

  confirm(message: string, title: string = 'Confirm'): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmResolve = resolve;
      this.show({ 
        message, 
        title, 
        type: 'confirm',
        confirmText: 'Confirm',
        cancelText: 'Cancel'
      });
    });
  }

  close(confirmed: boolean = false): void {
    this.modalSubject.next(null);
    if (this.confirmResolve) {
      this.confirmResolve(confirmed);
      this.confirmResolve = undefined;
    }
  }
}

