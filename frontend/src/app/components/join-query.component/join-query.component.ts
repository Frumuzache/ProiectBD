import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-join-query.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './join-query.component.html',
  styleUrls: ['./join-query.component.css'],
})
export class JoinQueryComponent implements OnInit, OnDestroy {
  data: any[] = [];
  filteredData: any[] = [];
  columns: string[] = [];
  loading = false;
  error: string | null = null;

  statusOptions = [
    { label: 'Toate', value: '' },
    { label: 'În curs', value: 'In procesare' }, // backend folosește "In procesare"
    { label: 'Livrat', value: 'Livrat' },
    { label: 'Anulat', value: 'Anulat' },
  ];
  ratingOptions = [
    { label: 'Nota > 4.5', value: 4.5 },
    { label: 'Nota > 4.0', value: 4.0 },
    { label: 'Nota > 3.5', value: 3.5 },
    { label: 'Orice notă', value: 0 }
  ];

  selectedStatus = ''; // implicit: nu filtrăm după status
  selectedRating = 0; // implicit fără filtru strict
  searchRestaurant = '';

  private refreshIntervalMs = 10000; // 10s auto-refresh
  private refreshHandle: any = null;

  // Helper pentru afișarea notei din coloana 'rating' (backend o trimite acum explicit)
  private getRating(row: any): number {
    const keys = Object.keys(row);
    const ratingKey = keys.find(k => k.toLowerCase().includes('rating') || k.toLowerCase().includes('nota'));
    return ratingKey ? Number(row[ratingKey]) : 0;
  }

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  fetchData(): void {
    this.loading = true;
    this.error = null;
    console.log('Fetching detailed orders (III.c) ...');

    this.apiService.getDetailedOrders(this.selectedStatus, this.selectedRating).subscribe({
      next: (res) => {
        this.data = res || [];
        this.columns = this.data.length > 0 ? Object.keys(this.data[0]) : [];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Eroare la cererea complexă:', err);
        this.error = err?.message || 'Eroare la încărcarea datelor.';
        this.filteredData = [];
      },
      complete: () => {
        this.loading = false;
      }
    }).add(() => {
      // Fallback în caz că complete nu se apelează
      this.loading = false;
    });
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(row => {
      const restaurantKey = Object.keys(row).find(k => k.toLowerCase().includes('rest'));
      const restaurantName = restaurantKey ? String(row[restaurantKey]) : '';
      const searchPass = restaurantName.toLowerCase().includes(this.searchRestaurant.trim().toLowerCase());
      return searchPass;
    });
  }

  onFiltersChange(): void {
    this.selectedRating = Number(this.selectedRating);
    // Folosim setTimeout pentru a ne asigura că Angular a terminat de actualizat modelul
    setTimeout(() => {
      this.fetchData();
    }, 0);
  }

  private startAutoRefresh(): void {
    this.stopAutoRefresh();
    this.refreshHandle = setInterval(() => {
      this.fetchData();
    }, this.refreshIntervalMs);
  }

  private stopAutoRefresh(): void {
    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
      this.refreshHandle = null;
    }
  }

}
