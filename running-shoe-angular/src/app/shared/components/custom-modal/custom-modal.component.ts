import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService, ModalConfig } from '../../../core/services/modal.service';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss']
})
export class CustomModalComponent implements OnInit, OnDestroy {
  config: ModalConfig | null = null;
  show = false;
  private subscription?: Subscription;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.subscription = this.modalService.modal$.subscribe(config => {
      this.config = config;
      this.show = !!config;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onConfirm(): void {
    this.modalService.close(true);
  }

  onCancel(): void {
    this.modalService.close(false);
  }

  onClose(): void {
    this.modalService.close(false);
  }

  getIcon(): string {
    switch (this.config?.type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'confirm':
        return 'bi-question-circle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }

  getIconClass(): string {
    switch (this.config?.type) {
      case 'success':
        return 'icon-success';
      case 'error':
        return 'icon-error';
      case 'warning':
        return 'icon-warning';
      case 'confirm':
        return 'icon-confirm';
      default:
        return 'icon-info';
    }
  }
}

