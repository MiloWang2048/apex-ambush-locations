import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AmbushLocationService } from './ambush-location.service';
import { CreateAmbushLocationDto } from './dto/create-ambush-location.dto';
import { UpdateAmbushLocationDto } from './dto/update-ambush-location.dto';

@Controller('ambush-location')
export class AmbushLocationController {
  constructor(private readonly ambushLocationService: AmbushLocationService) {}

  @Post()
  create(@Body() createAmbushLocationDto: CreateAmbushLocationDto) {
    return this.ambushLocationService.create(createAmbushLocationDto);
  }

  @Get()
  findAll() {
    return this.ambushLocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ambushLocationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmbushLocationDto: UpdateAmbushLocationDto) {
    return this.ambushLocationService.update(+id, updateAmbushLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ambushLocationService.remove(+id);
  }
}
