import { TestBed } from '@angular/core/testing';

import { ChessService } from './chess.service';

describe('ChessService', () => {
  let service: ChessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
