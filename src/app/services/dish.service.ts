import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  getDishes(): Observable<Dish[]> {
    //simulates a server call latency
    return of(DISHES).pipe(delay(2000));
  }

  getDish(id: string): Observable<Dish> {
    //simulates a server call latency
    return of(DISHES.filter(dish => dish.id === id)[0]).pipe(delay(2000));
  }

  getFeaturedDish(): Observable<Dish> {
    //simulates a server call latency
    return of(DISHES.filter((dish) => dish.featured)[0]).pipe(delay(2000));
  }
    
}
