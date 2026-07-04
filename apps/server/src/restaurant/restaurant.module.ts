import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { AuthModule } from '../auth/auth.module';
import { RestaurantRepository } from './restaurant.repo';

@Module({
  // @Module() NestJS ka container hai
  imports: [AuthModule], // Dusre modules yahan aate hain. means restraunt module ko auth module ke functionality chahiye."
  controllers: [RestaurantController], // HTTP Requests handle karne wale controllers.
  providers: [RestaurantService, RestaurantRepository], // Yahan business logic wali classes aati hain.

  //   Agar koi doosra module tumhari service use karega too export: [RestaurantService] use krna padega.
})
export class RestaurantModule {}
