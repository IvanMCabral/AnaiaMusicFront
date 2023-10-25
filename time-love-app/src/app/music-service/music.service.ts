
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  private musicList: string[] = [];
  private currentMusicIndex = 0;
  private apiUrl = 'http://localhost:8080/api';
  public progress$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  addValidToken(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/music/token`, token);
  }

  getMusicToken(): Observable<string> {
    return this.http.get(`${this.apiUrl}/music/token`, { responseType: 'text' });
  }

  getMusicStream(filename: string, token: string): Observable<ArrayBuffer> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ArrayBuffer>(`${this.apiUrl}/music/${filename}`, { headers, responseType: 'arraybuffer' as 'json' });
  }



  getMusicList(token: string): Observable<string[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<string[]>(`${this.apiUrl}/music/list`, { headers }).pipe(
      tap(musicList => {
        this.musicList = musicList;
      })
    );
  }

  addMusic(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post<any>(`${this.apiUrl}/song/register`, formData, { headers });
  }


  getCurrentMusicIndex(): number {
    return this.currentMusicIndex;
  }

  setCurrentMusicIndex(index: number) {
    this.currentMusicIndex = index;
  }

  getNextMusicIndex(): number {
    const nextIndex = this.currentMusicIndex + 1;
    if (nextIndex >= this.musicList.length) {
      return 0;
    }
    return nextIndex;
  }

  getPreviousMusicIndex(): number {
    const previousIndex = this.currentMusicIndex - 1;
    if (previousIndex < 0) {
      return this.musicList.length - 1;
    }
    return previousIndex;
  }



}
