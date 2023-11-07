import { IsOptional, IsString } from 'class-validator';

export class CreateACSTokenDto {
  @IsOptional()
  @IsString()
  public scope: string;
}

export class CreateChatThreadDto {
  @IsOptional()
  @IsString()
  public topicName: string;

  @IsOptional()
  @IsString()
  public displayName: string;
}

export class AddUserChatThreadDto {
  @IsString()
  public userId: string;

  @IsOptional()
  @IsString()
  public adminUserId: string;

  @IsOptional()
  @IsString()
  public displayName: string;
}

export class UserConfigDto {
  @IsString()
  emoji: string;

  @IsOptional()
  @IsString()
  displayName: string;

  @IsString()
  threadId: string;
}
