import { TestBed } from '@angular/core/testing';

import { PokeballsService } from './pokeballs.service';

describe('PokeballsService', () => {
  let service: PokeballsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeballsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
