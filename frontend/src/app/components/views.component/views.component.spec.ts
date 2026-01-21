import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewsComponent } from './views.component';

describe('ViewsComponent', () => {
  let component: ViewsComponent;
  let fixture: ComponentFixture<ViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
