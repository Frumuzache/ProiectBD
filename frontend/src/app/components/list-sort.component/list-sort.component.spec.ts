import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSortComponent } from './list-sort.component';

describe('ListSortComponent', () => {
  let component: ListSortComponent;
  let fixture: ComponentFixture<ListSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSortComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSortComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
