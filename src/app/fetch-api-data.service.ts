import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://myanimeflix.herokuapp.com/';

//Injectible tells Angular that this service will be available everywhere in the app (hence the root)
@Injectable({
  providedIn: 'root'
})

export class UserRegistrationService {
 // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
 // private - is a way of initializing the instance with whatever is given as a parameter.
  // It's a shortcut for the following:
  // constructor(http: HttpClient) {this.http = http}
  constructor(private http: HttpClient) {}

  /**
     * function - userRegistration
     * argument of type any "userDetails"
     * method - POST to API endpoint
     * returns - user object in json format or error
  */
  // Observable<any> shows the type of function return, considered as enhanced promise, as it allows you to process events asynchronously
  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    // apiUrl + 'users' - API endpoint
    // Using this.http, it posts it to the API endpoint and returns the API's response
    return (
      this.http
      .post(apiUrl + 'users', userDetails)
      // .pipe() (from RxJS) is used to combine multiple functions into a single function.
      .pipe(catchError(this.handleError))
    );
  }

  /**
   * function - userLogin
   * parametrs - of type any "userDetails"
   * method - POST to API endpoint
   * returns - user object in json format or error
  */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return (
      this.http
      .post(`${apiUrl}/login`, userDetails)
      .pipe(catchError(this.handleError))
    );
  }

  /**
   * function - getAllMovies
   * method - GET to API endpoint
   * returns - an array with all movies in json format or error
  */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - getMovie
   * parametrs - title type of string
   * method - GET to API endpoint
   * returns - json object with single movie info
   */
  public getMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - getDirector
   * parameters - directorName type of string
   * method - GET to API endpoint
   * returns - json object with director info
   */
  public getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/directors/' + directorName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - getGenre
   * parameters - genreName type of string
   * method - GET to API endpoint
   * returns - json object with genre info
   */
  public getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genre/' + genreName, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - getUser
   * method - GET to API endpoint
   * returns - json object with user info
   */
  public getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorisation: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - getFavoriteMovies
   * method - GET to API endpoint
   * returns - json array with favorite movies from user info
   */
  public getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorisation: 'Bearer' + token,
        }),
      })
      .pipe(
        map(this.extractResponseData),
        map((data) => data.FavoriteMovies),
        catchError(this.handleError)
      );
  }

  /**
   * function - addFavoriteMovie
   * parameters - movieId type of string
   * method - PUSH to API endpoint
   * returns - user object in json format or an error
   */
  public addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    return this.http
      .post(
        apiUrl + 'users/' + username + '/movies/' + movieId,
        { FavoriteMovies: movieId },
        {
          headers: new HttpHeaders({
            Authorisation: 'Bearer' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - deleteFavoriteMovie
   * parameters - movieId type of string
   * method - DELETE to API endpoint
   * returns - user object in json format or an error
   */
  public deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');

    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorisation: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - updateUser
   * parameters - type any "updateUserInfo"
   * method - PUT to API endpoint
   * returns - user object in json format or error
   */
  public updateUser(apdateUserInfo: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .put(apiUrl + 'users/' + username, apdateUserInfo, {
        headers: new HttpHeaders({
          Authorisation: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * function - deleteUser
   * method - DELETE to API endpoint
   * returns - mesage "@username was deleated"
   */
  public deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorisation: 'Bearer' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}