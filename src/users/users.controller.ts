import { Body, Controller, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ForgotPasswordDto, registerUserRequest, ResetPasswordDto, VerifyOtpDto } from "./dto/user.dto";
import { CurrentUser, User } from "@app/common";

@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Post('register')
    async register(
        @Body() request: registerUserRequest,
    ) {
        return this.usersService.registerUser(request)
    }

    @Post('forget-password')
    async forgetPassword(
        @Body() data: ForgotPasswordDto
    ) {
        return this.usersService.forgetPassword(data)
    }

    @Post('verify-otp')
    async verifyOtp(
        @Body() data: VerifyOtpDto
    ){
        return this.usersService.verifyOtp(data)
    }

    @Put('reset-password')
    async resetPassword(
        @Body() data: ResetPasswordDto,
        @CurrentUser() user: User
    ) {
        return this.usersService.resetPassword(data)
    }

}