import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-group-having.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './group-having.component.html',
  styleUrls: ['./group-having.component.css'],
})
export class GroupHavingComponent implements OnInit {
  data: any[] = [];
  filteredData: any[] = [];
  columns: string[] = [];
  loading = false;
  error: string | null = null;

  minProductsOptions = [
    { label: 'Minim 1 produs', value: 1 },
    { label: 'Minim 2 produse', value: 2 },
    { label: 'Minim 3 produse', value: 3 },
    { label: 'Minim 5 produse', value: 5 }
  ];

  selectedMinProducts = 2;
  searchRestaurant = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.error = null;
    console.log('Fetching restaurant stats (III.d) ...');

    this.apiService.getRestaurantStats(this.selectedMinProducts).subscribe({
      next: (res) => {
        this.data = res || [];
        this.columns = this.data.length > 0 ? Object.keys(this.data[0]) : [];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Eroare la statistici restaurante:', err);
        this.error = err?.message || 'Eroare la încărcarea datelor.';
        this.filteredData = [];
      },
      complete: () => {
        this.loading = false;
      }
    }).add(() => {
      this.loading = false;
    });
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(row => {
      const restaurantKey = Object.keys(row).find(k => k.toLowerCase().includes('nume'));
      const restaurantName = restaurantKey ? String(row[restaurantKey]) : '';
      const searchPass = restaurantName.toLowerCase().includes(this.searchRestaurant.trim().toLowerCase());
      return searchPass;
    });
  }

  onMinProductsChange(): void {
    this.selectedMinProducts = Number(this.selectedMinProducts);
    setTimeout(() => {
      this.fetchData();
    }, 0);
  }
}
