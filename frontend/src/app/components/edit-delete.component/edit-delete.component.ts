import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-delete',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-delete.component.html',
  styleUrl: './edit-delete.component.css'
})
export class EditDeleteComponent implements OnInit {
  tables = ['Alergeni', 'Alergeni_Produse', 'Comenzi', 'Livratori', 'PLati', 'Produse', 'Produse_Comanda', 'Raportari', 'Restaurante', 'Utilizatori'];
  selectedTable: string = 'Utilizatori';
  data: any[] = [];
  columns: string[] = [];
  editingRow: any = null;
  editingData: any = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.editingRow = null;
    this.editingData = {};
    this.successMessage = '';
    this.errorMessage = '';
    const apiEndpoint = this.getApiEndpoint(this.selectedTable);
    this.apiService.getList(apiEndpoint).subscribe({
      next: (res) => {
        this.data = res;
        if (this.data.length > 0) {
          this.columns = Object.keys(this.data[0]);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Eroare la încărcare: ' + err.message;
      }
    });
  }

  // Helper function to convert table name to API endpoint format
  getApiEndpoint(tableName: string): string {
    return tableName.toLowerCase().replace(/_/g, '-');
  }

  // Start inline editing for a row
  startEdit(row: any) {
    const primaryKey = this.columns[0];
    this.editingRow = row[primaryKey];
    this.editingData = { ...row };
  }

  // Cancel editing
  cancelEdit() {
    this.editingRow = null;
    this.editingData = {};
  }

  // Save edited row
  saveEdit() {
    if (!this.editingRow) return;

    const primaryKey = this.columns[0];
    const id = this.editingRow;
    
    // Create update object excluding primary key
    const updateData: any = {};
    for (const col of this.columns) {
      if (col !== primaryKey) {
        updateData[col] = this.editingData[col];
      }
    }

    const apiEndpoint = this.getApiEndpoint(this.selectedTable);
    this.apiService.update(apiEndpoint, id, updateData).subscribe({
      next: () => {
        this.successMessage = '✅ Modificare salvată cu succes!';
        setTimeout(() => this.successMessage = '', 3000);
        this.editingRow = null;
        this.editingData = {};
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = '⚠️ Eroare la modificare: ' + err.message;
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  // Delete a row
  onDelete(row: any) {
    const primaryKey = this.columns[0];
    const id = row[primaryKey];

    if (confirm(`Sigur dorești să ștergi înregistrarea cu ${primaryKey}: ${id}?`)) {
      const apiEndpoint = this.getApiEndpoint(this.selectedTable);
      this.apiService.delete(apiEndpoint, id).subscribe({
        next: () => {
          this.successMessage = '✅ Ștergere reușită!';
          setTimeout(() => this.successMessage = '', 3000);
          this.loadData();
        },
        error: (err) => {
          this.errorMessage = '⚠️ Eroare la ștergere: ' + err.message;
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  // Check if a row is being edited
  isEditing(row: any): boolean {
    const primaryKey = this.columns[0];
    return this.editingRow === row[primaryKey];
  }
}