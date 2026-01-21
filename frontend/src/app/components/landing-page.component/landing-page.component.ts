import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- ASIGURĂ-TE CĂ ESTE IMPORTAT

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule], // <--- TREBUIE SĂ FIE AICI
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {}