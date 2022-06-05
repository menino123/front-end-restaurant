import { TestBed } from '@angular/core/testing';

import { ServicioMesaService } from './servicio-mesa.service';

describe('ServicioMesaService', () => {
  let service: ServicioMesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioMesaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
