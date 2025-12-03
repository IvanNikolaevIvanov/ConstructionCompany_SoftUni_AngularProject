import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginResponse } from '../interfaces/LoginResponse';
import { environment } from 'environments/environment';

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

  it('should perform login and update loginData on success', () => {
    // Arrange
    const mockResponse: LoginResponse = {
      token: 'jwt123',
      userId: '1',
      role: 'admin',
    };

    const successSpy = jest.fn();

    // Act
    service.login('test@example.com', 'password', successSpy);

    // Assert
    const req = httpMock.expectOne('http://localhost:5247/api/Auth/login');
    expect(req.request.method).toBe('POST');

    //Fake backend success
    req.flush(mockResponse);

    // LoginData should be updated
    expect(service['loginData']()).toEqual(mockResponse);

    // computed signals should update
    expect(service.isLoggedIn()).toBe(true);
    expect(service.token()).toBe('jwt123');
    expect(service.role()).toBe('admin');
    expect(service.userId()).toBe('1');

    // onSuccess callback should be called
    expect(successSpy).toHaveBeenCalled();
  });

  it('should handle login error and call onError callback', () => {
    // Arrange
    const errorSpy = jest.fn();

    const errorMessage = 'Invalid credentials';
    const errorResponse = {
      status: 401,
      statusText: 'Unauthorized',
      error: { message: errorMessage },
    };

    // Act
    service.login('wrong@test.com', 'wrongpassword', undefined, errorSpy);

    const req = httpMock.expectOne('http://localhost:5247/api/Auth/login');
    req.flush(errorResponse.error, errorResponse);

    // Assert
    expect(service['loginData']()).toBeNull(); // loginData should remain null
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(errorMessage);
  });

  it('should perform register and update loginData on success', () => {
    // Arrange
    const mockResponse: LoginResponse = {
      token: 'register-token',
      role: 'user',
      userId: '99',
    };

    const successSpy = jest.fn();

    // Act
    service.register(
      'First',
      'Last',
      'first@example.com',
      'password123',
      successSpy,
    );

    const req = httpMock.expectOne(`http://localhost:5247/api/Auth/register`);
    expect(req.request.method).toBe('POST');

    //Fake backend success
    req.flush(mockResponse);

    //Assert
    expect(service['loginData']()).toEqual(mockResponse);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.token()).toBe('register-token');
    expect(service.role()).toBe('user');
    expect(service.userId()).toBe('99');

    expect(successSpy).toHaveBeenCalled();
  });

  it('should throw error on register failure', () => {
    // Arrange
    const successSpy = jest.fn();

    const errorResponse = {
      status: 500,
      statusText: 'Server error',
    };

    // Act
    service.register(
      'First',
      'Last',
      'first@example.com',
      'password123',
      successSpy,
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/Auth/register`);
    req.flush({ message: 'Email already exists' }, errorResponse);

    //Assert
    expect(successSpy).not.toHaveBeenCalled();
    expect(service.isLoggedIn()).toBe(false);
  });
});
