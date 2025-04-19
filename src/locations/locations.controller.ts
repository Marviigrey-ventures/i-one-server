import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LocationsService } from './locations.service';
import { CreateLocationDto, ViewNearbyLocationsDto } from './dto/location.dto';
import { CurrentUser, IsOwner, User } from '@app/common';

@Controller('location')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('all')
  async viewAllLocations() {
    return this.locationsService.viewAllLocations();
  }

  @Post('register')
  async registerLocation(
    @IsOwner() user: User,
    @Body() data: CreateLocationDto,
  ) {
    return this.locationsService.registerLocation(data);
  }

  @Get('nearby')
  async getNearbyLocations(@Body() data: ViewNearbyLocationsDto) {
    return this.locationsService.viewNearbyLocations(data);
  }

  @Get()
  async getMyLocation(@CurrentUser() user: User) {
    return this.locationsService.getMyLocation(user._id.toString());
  }
}
