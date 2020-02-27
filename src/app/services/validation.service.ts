import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  dishDetailCommentformErrors = {
    'author': '', 
    'comment': ''
  };

  dishDetailCommentvalidationMessages = {
    'author': {
      'required': 'Author\'s name is required.',
      'minlength': 'Author\'s name must be at least 2 characters long.',
    },
    'comment': {
      'required': 'Comment message is required.',
    },
  };

  contactFormErrors = {
    'firstname': '', 
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  contactValidationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  onValueChanged(inputForm: FormGroup, formErrors: any, validationMessages: any, data?: any) {
    if (!inputForm) { return; }
    const form = inputForm;
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
