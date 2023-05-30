import { tokenAndGroupNameSchema } from './schemas_legacy.js';

export function validateDesignTokenAndGroupName(tokenOrGroupName: string) {
  return tokenAndGroupNameSchema.parse(tokenOrGroupName);
}
