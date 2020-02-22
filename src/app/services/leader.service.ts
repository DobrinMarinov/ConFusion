import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Promise<Leader[]> {
    return new Promise(resolve => {
      //simulates a server call latency
      setTimeout(() => resolve(LEADERS), 2000);
    })    
  }

  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve => {
      //simulates a server call latency
      setTimeout(() => resolve(LEADERS.filter(leader => leader.featured === true)[0]), 2000);
    })
  }
    
}
