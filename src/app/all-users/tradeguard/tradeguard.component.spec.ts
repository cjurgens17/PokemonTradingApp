import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeguardComponent } from './tradeguard.component';

describe('TradeguardComponent', () => {
  let component: TradeguardComponent;
  let fixture: ComponentFixture<TradeguardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeguardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradeguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
