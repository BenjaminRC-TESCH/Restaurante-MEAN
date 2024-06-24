import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserShopCartComponent } from './user-shop-cart.component';

describe('UserShopCartComponent', () => {
  let component: UserShopCartComponent;
  let fixture: ComponentFixture<UserShopCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserShopCartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserShopCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
