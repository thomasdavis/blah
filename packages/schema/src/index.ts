import Ajv from 'ajv';
import schema from './schema.json';

export interface ValidationResult {
  valid: boolean;
  errors: any[] | null;
}

export class BlahValidator {
  private ajv: Ajv;
  private validateFn: any;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    this.validateFn = this.ajv.compile(schema);
  }

  validate(data: any): ValidationResult {
    const valid = this.validateFn(data);
    return {
      valid,
      errors: this.validateFn.errors
    };
  }
}

export { schema };
export default BlahValidator;
