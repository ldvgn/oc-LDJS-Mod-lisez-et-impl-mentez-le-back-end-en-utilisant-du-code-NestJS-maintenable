import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { CreateRentalDto } from './create-request.dto';

export class UpdateRentalDto extends IntersectionType(
  OmitType(CreateRentalDto, ['picture']),
  PartialType(PickType(CreateRentalDto, ['picture'])),
) {}
