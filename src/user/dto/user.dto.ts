import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsArray()
  @IsString({ each: true }) // "each" tells class-validator to run the validation on each item of the array
  @ArrayMinSize(1)
  roles: string[];
}
