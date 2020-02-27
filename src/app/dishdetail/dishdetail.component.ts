import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    comment: string;
    stars: number;
    author: string;
    commentForm: FormGroup; 
    @ViewChild('fform', {static: false}) commentFormDirective: any;

    formErrors = {
      'author': '', 
      'comment': ''
    };
  
    validationMessages = {
      'author': {
        'required': 'Author\'s name is required.',
        'minlength': 'Author\'s name must be at least 2 characters long.',
      },
      'comment': {
        'required': 'Comment message is required.',
      },
    };

    constructor(private dishService: DishService, private location: Location, 
      private route: ActivatedRoute, private formBuilder: FormBuilder) {
        this.createCommentForm();
      }

    ngOnInit() {
      // let id = this.route.snapshot.params['id'];
      // this.dishService.getDish(id).subscribe(dish => this.dish = dish);

      this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });

    }

    goBack(): void {
      this.location.back();
    }

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    createCommentForm(): void {
      this.commentForm = this.formBuilder.group({
        author: ['', [Validators.required, Validators.minLength(2)]],
        rating: ['5'],
        comment: ['', Validators.required],
      });
      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
  
      this.onValueChanged(); // reset validation messages
     
      this.commentForm.valueChanges
      .subscribe(data => this.populateFieldsOnChange(data));
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

    populateFieldsOnChange(data: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      this.author = form.get('author').value;
      this.stars = form.get('rating').value;
      this.comment = form.get('comment').value;
    }

    onSubmit() {
      this.comment = this.commentForm.value;
      console.log(this.comment);
      this.commentForm.reset({
        author: '',
        rating: '5',
        comment: ''
      });
      this.commentFormDirective.reset();
    }

}
