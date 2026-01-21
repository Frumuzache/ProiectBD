import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page.component/landing-page.component';
// Importă componentele corespunzătoare fiecărei cerințe
import { ListSortComponent } from './components/list-sort.component/list-sort.component';
import { EditDeleteComponent } from './components/edit-delete.component/edit-delete.component';
import { JoinQueryComponent } from './components/join-query.component/join-query.component';
import { GroupHavingComponent } from './components/group-having.component/group-having.component';
import { CascadeComponent } from './components/cascade.component/cascade.component';
import { ViewsComponent } from './components/views.component/views.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Root: localhost:4200/
  { path: 'a', component: ListSortComponent },    // Cerinta III.a
  { path: 'b', component: EditDeleteComponent },  // Cerinta III.b
  { path: 'c', component: JoinQueryComponent },   // Cerinta III.c
  { path: 'd', component: GroupHavingComponent }, // Cerinta III.d
  { path: 'e', component: CascadeComponent },     // Cerinta III.e
  { path: 'f', component: ViewsComponent },       // Cerinta III.f (Vizualizări)
];