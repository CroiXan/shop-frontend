import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function samePasswordValidator(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(field1)?.value;
      const confirmPassword = control.get(field2)?.value;
      const forbidden = password && confirmPassword && password !== confirmPassword;
      return forbidden ? {notSamePassword: {value: control.value}} : null;
    };
}