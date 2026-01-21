import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupHavingComponent } from './group-having.component';

describe('GroupHavingComponent', () => {
  let component: GroupHavingComponent;
  let fixture: ComponentFixture<GroupHavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupHavingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupHavingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
