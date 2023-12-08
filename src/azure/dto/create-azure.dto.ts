import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateACSTokenDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public scope: string;
}

export class CreateChatThreadDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public topicName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public displayName: string;
}

export class AddUserChatThreadDto {
  @ApiProperty()
  @IsString()
  public userId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public adminUserId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public displayName: string;
}

export class UserConfigDto {
  @ApiProperty()
  @IsString()
  emoji: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsString()
  threadId: string;
}

export class AddParticipantsDto {
  @ApiProperty()
  @IsNotEmpty()
  idUser: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role: string;
}
