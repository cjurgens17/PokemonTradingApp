import { TestBed } from '@angular/core/testing';

import { PokemonCardGuard } from './pokemon-card.guard';

describe('PokemonCardGuard', () => {
  let guard: PokemonCardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PokemonCardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
