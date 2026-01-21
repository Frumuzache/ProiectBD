import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface OrderDetailed {
  id_comanda: number;
  client: string;
  restaurant: string;
  status: string;
  reports: any[];
  payments: any[];
  items: any[];
}

@Component({
  selector: 'app-cascade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cascade.component.html',
  styleUrl: './cascade.component.css',
})
export class CascadeComponent implements OnInit, OnDestroy {
  orders: OrderDetailed[] = [];
  loading = false;
  error = '';
  successMessage = '';
  expandedOrderId: number | null = null;
  private refreshHandle: any;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) clearInterval(this.refreshHandle);
  }

  fetchData(): void {
    this.loading = true;
    this.apiService.getOrders().subscribe({
      next: (res: any) => {
        const dataArray = res.rows || res || [];
        this.orders = dataArray.map((order: any) => ({
          id_comanda: order.id_comanda || order.ID_COMANDA,
          client: order.client || order.CLIENT || 'Nespecificat',
          restaurant: order.restaurant || order.RESTAURANT || 'Nespecificat',
          status: order.status || order.STATUS || 'In procesare',
          reports: [],
          payments: [],
          items: []
        }));
        this.fetchAllDetails();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); }
    });
  }

  private fetchAllDetails(): void {
    // 1. Fetch Reports
    this.apiService.getReports().subscribe((res: any) => {
      const reports = res.rows || res || [];
      this.orders.forEach(o => o.reports = reports.filter((r: any) => (r.id_comanda || r.ID_COMANDA) === o.id_comanda));
      this.cdr.detectChanges();
    });

    // 2. Fetch Payments
    this.apiService.getPayments().subscribe((res: any) => {
      const payments = res.rows || res || [];
      this.orders.forEach(o => o.payments = payments.filter((p: any) => (p.id_comanda || p.ID_COMANDA) === o.id_comanda));
      this.cdr.detectChanges();
    });

    // 3. Fetch Order Items (Produse)
    this.apiService.getOrderItems().subscribe((res: any) => {
      const items = res.rows || res || [];
      this.orders.forEach(o => o.items = items.filter((i: any) => (i.id_comanda || i.ID_COMANDA) === o.id_comanda));
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  toggleExpand(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
    this.cdr.detectChanges();
  }

  onDelete(orderId: number, client: string): void {
    if (confirm(`⚠️ DEMONSTRAȚIE ON DELETE CASCADE\n\nȘtergerea comenzii #${orderId} a clientului ${client} va șterge AUTOMAT:\n✓ Toate plățile asociate\n✓ Toate produsele din comandă\n✓ Toate raportările\n\nIntroduceți OK pentru confirmare.`)) {
      this.apiService.deleteOrder(orderId).subscribe({
        next: () => {
          this.successMessage = `✅ Comanda #${orderId} a fost ștearsă cu succes!\n📋 Plățile, produsele și raportările au fost eliminate automat prin CASCADE.`;
          this.fetchData();
        },
        error: (err: any) => {
          this.error = err.error?.error || 'Eroare la ștergere';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  getReportCount(orderId: number): number {
    const order = this.orders.find(o => o.id_comanda === orderId);
    return order?.reports.length || 0;
  }
}