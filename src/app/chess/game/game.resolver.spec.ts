import { TestBed } from '@angular/core/testing';

import { GameResolver } from './game.resolver';

describe('GameResolver', () => {
  let resolver: GameResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(GameResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
