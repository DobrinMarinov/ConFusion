import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { visibility, flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

    dish: Dish;
    dishCopy: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    comment: string;
    stars: number;
    author: string;
    submissionComment: Comment;
    commentForm: FormGroup; 
    errorMessage: string;
    visibility = 'shown';
    @ViewChild('fform', {static: false}) commentFormDirective: any;

    formErrors = this.validationService.dishDetailCommentformErrors;

    validationMessages = this.validationService.dishDetailCommentvalidationMessages;

    constructor(private dishService: DishService, private location: Location, 
      private route: ActivatedRoute, private formBuilder: FormBuilder, 
      private validationService: ValidationService, @Inject('baseURL') private baseURL) {
        this.createCommentForm();
      }

    ngOnInit() {
      // let id = this.route.snapshot.params['id'];
      // this.dishService.getDish(id).subscribe(dish => this.dish = dish);

      this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'}, 
      errorMsg => this.errorMessage = errorMsg);
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
        rating: [5],
        comment: ['', Validators.required],
      });
      this.commentForm.valueChanges
      .subscribe(data => this.validationService.onValueChanged(this.commentForm, this.formErrors, this.validationMessages, data));

      this.validationService.onValueChanged(this.commentForm,  this.formErrors, this.validationMessages); // reset validation messages
     
      this.commentForm.valueChanges
      .subscribe(data => this.populateFieldsOnChange(data));
    }

    populateFieldsOnChange(data: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      this.author = form.get('author').value;
      this.stars = form.get('rating').value;
      this.comment = form.get('comment').value;
    }

    onSubmit() {
      this.submissionComment = this.commentForm.value;
      console.log(this.comment);
      this.addCommentToList(this.stars);
      this.dishService.putDish(this.dishCopy).subscribe(dish => {this.dish = dish; this.dishCopy = dish;}, 
        errorMsg => { this.dish =null, this.dishCopy = null; this.errorMessage = <any>errorMsg; })
      this.commentForm.reset({
        author: '',
        rating: '5',
        comment: ''
      });
      this.commentFormDirective.reset();
    }

    addCommentToList(stars: number) {
      this.submissionComment = {
        rating: stars,
        comment: this.comment,
        author: this.author,
        date: new Date().toISOString()
      };
      this.dishCopy.comments.push(this.submissionComment);
    }

}
