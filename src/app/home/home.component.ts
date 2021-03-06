import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { Promotion } from '../shared/promotion';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  featuredLeader: Leader;
  errorMessage: string;

  constructor(private dishService: DishService, 
    private promotionService: PromotionService, private leaderService: LeaderService,
    @Inject('baseURL') public baseURL) { }

  ngOnInit() {
    this.getFeaturedDish();
    this.getFeaturedPromotion();
    this.getFeaturedLeader();
  }

  getFeaturedDish() {
    this.dishService.getFeaturedDish()
      .subscribe(dish => this.dish = dish, errorMess => this.errorMessage = errorMess);
  }

  getFeaturedPromotion() {
    this.promotionService.getFeaturedPromotion()
      .subscribe(promotion => this.promotion = promotion, errorMess => this.errorMessage = errorMess);
  }
  
  getFeaturedLeader() {
    this.leaderService.getFeaturedLeader()
      .subscribe(leader => this.featuredLeader = leader, errorMess => this.errorMessage = errorMess);
  }

}
