import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { Promotion } from '../shared/promotion';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  featuredLeader: Leader;

  constructor(private dishService: DishService, 
    private promotionService: PromotionService, private leaderService: LeaderService,
    @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe(dish => this.dish = dish);
    this.promotionService.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion);
    this.leaderService.getFeaturedLeader().subscribe(leader => this.featuredLeader = leader);
  }

  getDish(id: string): Dish {
    return DISHES.filter((dish) => (dish.id))[0];
  }

  getFeaturedDish(): Dish {
    return DISHES.filter((dish) => dish.featured)[0];
  }

}
