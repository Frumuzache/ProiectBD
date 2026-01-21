import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-views.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './views.component.html',
  styleUrl: './views.component.css',
})
export class ViewsComponent implements OnInit {
  // Simple View Data (Editable)
  simpleViews: any[] = [];
  // Complex View Data (Read-only Statistics)
  complexViews: any[] = [];
  
  loading = false;
  error = '';
  successMessage = '';
  activeTab: 'simple' | 'complex' = 'simple';
  editingId: number | null = null;
  editingStatus: string = '';
  
  statusOptions = [
    { label: 'In procesare', value: 'In procesare' },
    { label: 'In pregatire', value: 'In pregatire' },
    { label: 'In livrare', value: 'In livrare' },
    { label: 'Livrat', value: 'Livrat' },
    { label: 'Anulat', value: 'Anulat' }
  ];

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadViews();
  }

  loadViews(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.getViewsSimple().subscribe({
      next: (data: any) => {
        this.simpleViews = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading simple views:', err);
        this.error = 'Failed to load simple view: ' + (err.error?.error || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.apiService.getViewsComplex().subscribe({
      next: (data: any) => {
        this.complexViews = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading complex views:', err);
        this.error = 'Failed to load complex view: ' + (err.error?.error || err.message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  switchTab(tab: 'simple' | 'complex'): void {
    this.activeTab = tab;
    this.editingId = null;
    this.successMessage = '';
  }

  startEdit(orderId: number, currentStatus: string): void {
    this.editingId = orderId;
    this.editingStatus = currentStatus;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingStatus = '';
  }

  updateStatus(): void {
    if (!this.editingId || !this.editingStatus) return;

    this.apiService.updateViewStatus(this.editingId, this.editingStatus).subscribe({
      next: () => {
        this.successMessage = `✅ Status updated successfully through VIEW!`;
        this.editingId = null;
        this.cdr.detectChanges();
        setTimeout(() => this.loadViews(), 1000);
      },
      error: (err: any) => {
        this.error = 'Error updating status: ' + (err.error?.error || err.message);
        this.cdr.detectChanges();
      }
    });
  }

  deleteOrder(orderId: number, client: string): void {
    if (confirm(`Delete order #${orderId} from ${client}? (CASCADE will delete all related data)`)) {
      this.apiService.deleteViewSimple(orderId).subscribe({
        next: () => {
          this.successMessage = `✅ Order #${orderId} deleted successfully through VIEW!`;
          this.cdr.detectChanges();
          setTimeout(() => this.loadViews(), 1000);
        },
        error: (err: any) => {
          this.error = 'Error deleting order: ' + (err.error?.error || err.message);
          this.cdr.detectChanges();
        }
      });
    }
  }
}
