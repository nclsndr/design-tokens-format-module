import { tokenAndGroupNameSchema } from './schemas.js';

export function validateDesignTokenAndGroupName(tokenOrGroupName: string) {
  return tokenAndGroupNameSchema.parse(tokenOrGroupName);
}
