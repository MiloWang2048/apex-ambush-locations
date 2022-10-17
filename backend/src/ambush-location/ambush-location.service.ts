import { Injectable } from '@nestjs/common';
import { CreateAmbushLocationDto } from './dto/create-ambush-location.dto';
import { UpdateAmbushLocationDto } from './dto/update-ambush-location.dto';

@Injectable()
export class AmbushLocationService {
  create(createAmbushLocationDto: CreateAmbushLocationDto) {
    return 'This action adds a new ambushLocation';
  }

  findAll() {
    return `This action returns all ambushLocation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ambushLocation`;
  }

  update(id: number, updateAmbushLocationDto: UpdateAmbushLocationDto) {
    return `This action updates a #${id} ambushLocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} ambushLocation`;
  }
}
