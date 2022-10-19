import { tokenAndGroupNameSchema } from './schemas.js';

export function validateTokenAndGroupName(tokenOrGroupName: string) {
  return tokenAndGroupNameSchema.parse(tokenOrGroupName);
}
