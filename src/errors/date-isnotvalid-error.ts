import { ApplicationError } from '@/protocols';

export function dateIsNotValid(): ApplicationError {
  return {
    name: 'DateIsNotValid',
    message: 'Invalid date!',
  };
}
