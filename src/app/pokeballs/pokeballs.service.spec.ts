import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PokeballsService } from './pokeballs.service';
import { Timer } from './timer';



describe('PokeballsService', () => {
  let service: PokeballsService;
  let httpTestingController: HttpTestingController;
  let apiUrl = 'http://localhost:8080/timer';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeballsService],
    });
    service = TestBed.inject(PokeballsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
//--------------------
  describe('getTimer', () => {
    it('should retrieve the timer from the API', () => {
      const id = 1;
      const mockTimer: Timer = {
        id: 1,
        prevDate: new Date(),
      };

      service.getTimer(id).subscribe((timer) => {
        expect(timer).toEqual(mockTimer);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/${id}/getTimer`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTimer);
    });
  });
//---------------
  describe('updateTimer', () => {
    it('should update the timer through the API', () => {
      const id = 123;
      const mockTimer: Timer = {
        id: 1,
        prevDate: new Date(),
      };

      service.updateTimer(id).subscribe((timer) => {
        expect(timer).toEqual(mockTimer);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/${id}/updateTimer`);
      expect(req.request.method).toBe('POST');
      req.flush(mockTimer);
    });
    });

  });

  // Add more test cases for the remaining methods of the service

