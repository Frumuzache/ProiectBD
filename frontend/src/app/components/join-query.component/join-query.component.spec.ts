import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinQueryComponent } from './join-query.component';

describe('JoinQueryComponent', () => {
  let component: JoinQueryComponent;
  let fixture: ComponentFixture<JoinQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinQueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinQueryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
