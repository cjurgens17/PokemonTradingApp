import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokeballsComponent } from './pokeballs.component';
import { PokeballsService } from './shared/services/pokeballs.service';
import { of } from 'rxjs';
import { Timer } from './shared/interfaces/timer';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('PokeballsComponent', () => {
  let component: PokeballsComponent;
  let fixture: ComponentFixture<PokeballsComponent>;
  let mockPokeBallsService: jasmine.SpyObj<PokeballsService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
     mockPokeBallsService = jasmine.createSpyObj<PokeballsService>('PokeballsService', [
      'updateUserPokeBalls',
      'updateTimer',
      'updateTimerSubject',
    ]);

    mockSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ PokeballsComponent ],
      providers: [
        { provide: PokeballsService, useValue: mockPokeBallsService },
        {provide: MatSnackBar, useValue: mockSnackBar}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokeballsComponent);
    component = fixture.componentInstance;
    component.userId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update Pokemon Balls and update timer', () => {
    //arrange
    const pokeBallCount = 10;
    const timerValue: Timer = {
      id: 1,
      prevDate: new Date(Date.now())
    }
    ;
    const returnTimerValue : Timer = {...timerValue, prevDate: new Date(timerValue.prevDate.getDate() + 1)};

    //Act
    mockPokeBallsService.updateUserPokeBalls.and.returnValue(of(10));
    mockPokeBallsService.updateTimer.and.returnValue(of(returnTimerValue));

    component.resetPokemonBalls();

    //Assert
    expect(mockPokeBallsService.updateUserPokeBalls).toHaveBeenCalledWith(component.userId, pokeBallCount);
    expect(mockPokeBallsService.updateTimer).toHaveBeenCalledWith(component.userId);
    expect(mockPokeBallsService.updateTimerSubject).toHaveBeenCalledWith(returnTimerValue);
    expect(mockSnackBar.open).toHaveBeenCalled();
  });



});
