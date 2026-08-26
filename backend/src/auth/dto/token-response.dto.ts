import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiLDOzI1JiIsInR...',
    description: "Token de l'utilisateur",
  })
  token!: string;
}
