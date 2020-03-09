import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { ValidationService } from '../services/validation.service';
import { flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut()
  ]
})
export class ContactComponent implements OnInit {
  
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  errorMessage: string;
  isSpinnerVisible: boolean;
  isFeedbackVisible: boolean;
  isFormVisible: boolean;
  @ViewChild('fform', {static: true}) feedbackFormDirective: any;

  formErrors = this.validationService.contactFormErrors;

  validationMessages = this.validationService.contactValidationMessages;

  constructor(private formBuilder: FormBuilder, 
    private validationService: ValidationService, 
    private feedbackService: FeedbackService) {
    this.createForm();
   }

  ngOnInit() {
  }

  createForm(): void {
    this.feedbackForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.validationService.onValueChanged(this.feedbackForm, this.formErrors, this.validationMessages, data));

    this.validationService.onValueChanged(this.feedbackForm, this.formErrors, this.validationMessages);
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.postFeedback(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.reset();
  }

  postFeedback(feedback: Feedback) {
    this.isFormVisible = true;
    this.isSpinnerVisible = true;
    this.feedbackService.postFeedback(this.feedback)
      .subscribe(feedback => {
        this.feedback = feedback;
        this.isSpinnerVisible = false;
        this.isFeedbackVisible = true;
        setTimeout(() => {
          this.feedback = null;
          this.isFeedbackVisible = false;
          this.isFormVisible = false;
        }, 5000);
      }, errorMsg => { this.feedback = null; this.errorMessage = <any>errorMsg; });
  }
  
}
