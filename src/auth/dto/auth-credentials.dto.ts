import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/(?=.*[A-Z])/, { message: 'password must contain at least one uppercase letter' })
    @Matches(/(?=.*[a-z])/, { message: 'password must contain at least one lowercase letter' })
    @Matches(/(?=.*\d)/, { message: 'password must contain at least one number' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'password must contain at least one special character' })
    password: string;
}