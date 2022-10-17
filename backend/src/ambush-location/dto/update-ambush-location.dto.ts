import { PartialType } from '@nestjs/mapped-types';
import { CreateAmbushLocationDto } from './create-ambush-location.dto';

export class UpdateAmbushLocationDto extends PartialType(CreateAmbushLocationDto) {}
