import { PartialType } from '@nestjs/mapped-types';
import { CreateCommnetDto } from './create-comment.dto';

export class UpdateCommnetDto extends PartialType(CreateCommnetDto) {}
