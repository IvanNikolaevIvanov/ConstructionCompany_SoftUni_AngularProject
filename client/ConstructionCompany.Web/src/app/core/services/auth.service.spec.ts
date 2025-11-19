import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginResponse } from '../interfaces/LoginResponse';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loginData = null when no user is saved', () => {
    expect(service['loginData']()).toBeNull();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.token()).toBeNull();
  });

  it('should save loginData', () => {
    const mockData: LoginResponse = {
      token: 'test-token',
      role: 'User',
      userId: '123',
    };

    service['loginData'].set(mockData); // Directly set the signal for testing

    expect(service.isLoggedIn()).toBe(true);
    expect(service.token()).toBe('test-token');
    expect(service.role()).toBe('User');
    expect(service.userId()).toBe('123');
  });

  it('should clear loginData when logout() is called', () => {
    // First, manually set loginData to simulate a logged-in user
    const mockUser: LoginResponse = {
      userId: '42',
      token: 'abc123',
      role: 'user',
    };
    service['loginData'].set(mockUser);

    // Verify initial computed signals
    expect(service.isLoggedIn()).toBe(true);
    expect(service.token()).toBe('abc123');

    // Call logout
    service.logout();

    // loginData should be null
    expect(service['loginData']()).toBeNull();

    // Computed signals should update
    expect(service.isLoggedIn()).toBe(false);
    expect(service.token()).toBeNull();
    expect(service.role()).toBeUndefined();
    expect(service.userId()).toBeUndefined();
  });
});
