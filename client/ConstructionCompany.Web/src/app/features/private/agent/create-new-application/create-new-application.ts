import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ApplicationFileModel } from 'app/models';
import { PriceIntoWordsPipe } from 'app/shared/pipes';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FileUpload } from '../file-upload/file-upload';

@Component({
  selector: 'create-new-application',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PriceIntoWordsPipe,
    NgxMaskDirective,
    FileUpload,
  ],
  providers: [
    provideNgxMask({ dropSpecialCharacters: false }),
    PriceIntoWordsPipe,
  ],
  templateUrl: './create-new-application.html',
  styleUrl: './create-new-application.scss',
})
export class CreateNewApplication {
  applicationForm: FormGroup;
  files: ApplicationFileModel[] = [];
  priceInWords: string = '';
  numericPrice: number | null = null; // store numeric price for the pipe

  banks: string[] = [
    'Bank of Cyprus',
    'Hellenic Bank',
    'Alpha Bank',
    'Eurobank',
    'AstroBank',
  ];

  constructor(
    private fb: FormBuilder,
    pricePipe: PriceIntoWordsPipe,
  ) {
    this.applicationForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
        ],
      ],
      clientName: ['', [Validators.required, Validators.maxLength(50)]],
      clientBank: ['', [Validators.required]],
      clientBankIban: ['', Validators.maxLength(34)],
      price: ['', [Validators.required, this.priceFormatValidator]],
      priceInWords: [''],
      usesConcrete: [false],
      usesBricks: [false],
      usesSteel: [false],
      usesInsulation: [false],
      usesWood: [false],
      usesGlass: [false],
    });

    // Subscribe to price changes
    this.applicationForm.get('price')?.valueChanges.subscribe((value) => {
      this.numericPrice = this.convertPriceToNumber(value);

      const words = pricePipe.transform(this.numericPrice || 0);
      this.applicationForm
        .get('priceInWords')
        ?.setValue(words, { emitEvent: false });
    });
  }

  priceFormatValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').toString().trim();

    if (!value) return null;

    // 1. Remove spaces (mask might add thin spaces)
    const cleanValue = value.replace(/\s/g, '');

    // 2. Validate format: optional thousands separators, comma as decimal
    const euroRegex = /^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/;

    return euroRegex.test(cleanValue) ? null : { invalidPriceFormat: true };
  }

  // Getter shortcuts
  get title(): AbstractControl<any, any> | null {
    return this.applicationForm.get('title');
  }

  get description(): AbstractControl<any, any> | null {
    return this.applicationForm.get('description');
  }

  get clientName(): AbstractControl<any, any> | null {
    return this.applicationForm.get('clientName');
  }

  get clientBank(): AbstractControl<any, any> | null {
    return this.applicationForm.get('clientBank');
  }

  get clientBankIban(): AbstractControl<any, any> | null {
    return this.applicationForm.get('clientBankIban');
  }

  get price(): AbstractControl<any, any> | null {
    return this.applicationForm.get('price');
  }

  // Validation status getters
  get isTitleValid(): boolean {
    return (
      (this.title?.invalid && (this.title?.dirty || this.title?.touched)) ||
      false
    );
  }

  get isClientNameValid(): boolean {
    return (
      (this.clientName?.invalid &&
        (this.clientName?.dirty || this.clientName?.touched)) ||
      false
    );
  }

  get isPriceValid(): boolean {
    return (
      (this.price?.invalid && (this.price?.dirty || this.price?.touched)) ||
      false
    );
  }

  get isClientBankValid(): boolean {
    return (
      (this.clientBank?.invalid &&
        (this.clientBank?.dirty || this.clientBank?.touched)) ||
      false
    );
  }

  get isClientIBANValid(): boolean {
    return (
      (this.clientBankIban?.invalid &&
        (this.clientBankIban?.dirty || this.clientBankIban?.touched)) ||
      false
    );
  }

  get isDescriptionValid(): boolean {
    return (
      (this.description?.invalid &&
        (this.description?.dirty || this.description?.touched)) ||
      false
    );
  }

  get titleErrorMessage(): string {
    if (this.title?.errors?.['required']) {
      return 'Title is required!';
    }

    if (this.title?.errors?.['maxlength']) {
      return 'Title should have maximum of 50 characters!';
    }

    return '';
  }

  get clientNameErrorMessage(): string {
    if (this.clientName?.errors?.['required']) {
      return "Client's Name is required!";
    }

    if (this.clientName?.errors?.['maxlength']) {
      return "Client's Name should have maximum of 50 characters!";
    }

    return '';
  }

  get descriptionErrorMessage(): string {
    if (this.description?.errors?.['required']) {
      return 'Description is required!';
    }

    if (this.description?.errors?.['maxlength']) {
      return 'Description should have maximum of 500 characters!';
    }

    return '';
  }

  get priceErrorMessage(): string {
    if (this.price?.errors?.['required']) {
      return 'Price is required!';
    }
    if (this.price?.errors?.['invalidPriceFormat']) {
      return 'Price format is invalid! Use format like 1.234,56';
    }

    return '';
  }

  get clientBankErrorMessage(): string {
    if (this.clientBank?.errors?.['required']) {
      return "Client's Bank is required!";
    }
    return '';
  }

  get clientIBANErrorMessage(): string {
    if (this.clientBankIban?.errors?.['maxlength']) {
      return "Client's IBAN should not exceed 34 characters!";
    }
    return '';
  }

  onSave() {
    // Convert to numeric before sending to backend
    const numeric = this.numericPrice ?? 0;
    console.log('Saving price:', numeric);
  }

  onFilesChanged(newFiles: ApplicationFileModel[]) {
    this.files = newFiles;
  }

  // Convert price string like "1.234,56" to numeric 1234.56 for API
  convertPriceToNumber(formatted: string): number | null {
    if (formatted == null) return null;

    const str = String(formatted); // safe conversion
    const numericString = str.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(numericString);
    return isNaN(num) ? null : num;
  }
}
