import { LocationCoordinates } from "@app/common";
import { Type } from "class-transformer";
import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, isEnum, IsEnum, IsArray, ArrayMinSize, IsNumber, ValidateNested, MinLength } from "class-validator";


export class registerUserRequest {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsNotEmpty()
  location: LocationCoordinates
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;
}



export class ResetPasswordDto {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;
}
