import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRolsComponent } from './admin-rols.component';

describe('AdminRolsComponent', () => {
  let component: AdminRolsComponent;
  let fixture: ComponentFixture<AdminRolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminRolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
