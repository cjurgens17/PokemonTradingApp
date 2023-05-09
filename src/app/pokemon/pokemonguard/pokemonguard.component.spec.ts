import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonguardComponent } from './pokemonguard.component';

describe('PokemonguardComponent', () => {
  let component: PokemonguardComponent;
  let fixture: ComponentFixture<PokemonguardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonguardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
