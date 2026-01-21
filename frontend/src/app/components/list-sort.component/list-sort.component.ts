import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-sort',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-sort.component.html',
  styleUrls: ['./list-sort.component.css']
})
export class ListSortComponent implements OnInit {
  // Lista ta actualizată de tabele
  tables = [
    'Alergeni',
    'Alergeni_Produse',
    'Comenzi',
    'Livratori',
    'PLati', 
    'Produse',
    'Produse_Comanda',
    'Raportari',
    'Restaurante',
    'Utilizatori'
  ];

  selectedTable: string = 'Alergeni'; // Tabel inițial
  data: any[] = [];
  columns: string[] = [];

  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef // Pentru a elimina "al doilea click"
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // Se apelează automat la schimbarea din drop-down
  onTableChange() {
    console.log("Schimbare tabel selectat:", this.selectedTable);
    this.loadData();
  }

  loadData(sortBy?: string) {
    // Curățăm datele înainte de cerere pentru feedback vizual
    this.data = [];
    this.columns = [];

    // Transformăm numele în lowercase pentru URL (ex: 'Comenzi' -> 'comenzi')
    // Important: Rutele din server.js trebuie să fie cu litere mici!
    const apiEndpoint = this.selectedTable.toLowerCase().replace('_', '-');

    console.log(`Cerere API: http://localhost:3000/api/${apiEndpoint}`);

    this.apiService.getList(apiEndpoint, sortBy).subscribe({
      next: (res) => {
        this.data = res;
        if (this.data && this.data.length > 0) {
          this.columns = Object.keys(this.data[0]);
        }
        
        // Forțăm Angular să redeseneze tabelul imediat
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Eroare la încărcare date:", err);
      }
    });
  }

  sort(column: string) {
    this.loadData(column);
  }
}