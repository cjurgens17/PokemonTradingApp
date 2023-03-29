import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonCardsComponent } from './pokemoncards.component';

describe('PracticeComponent', () => {
  let component: PokemonCardsComponent;
  let fixture: ComponentFixture<PokemonCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
