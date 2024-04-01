import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ITEM = 'isPublic';
export const PublicRoute = () => SetMetadata(IS_PUBLIC_ITEM, true);
