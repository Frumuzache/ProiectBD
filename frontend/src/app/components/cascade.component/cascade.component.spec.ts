import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CascadeComponent } from './cascade.component';

describe('CascadeComponent', () => {
  let component: CascadeComponent;
  let fixture: ComponentFixture<CascadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CascadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CascadeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
