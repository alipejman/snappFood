import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIdentityCard, IsMobilePhone, Length } from "class-validator";

export class supplierSignUpDto {
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  @Length(3, 50)
  store_name: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  @Length(3, 50)
  manager_name: string;
  @ApiProperty()
  @Length(3, 50)
  manager_family: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "mobile number is invalid" })
  phone: string;
  @ApiProperty({nullable: true})
  invite_code: string;
}


export class supplimantryInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsIdentityCard("IR")
  national_code: string;
}

export class uploadDocsDto {
  @ApiProperty({format: "binary"})
  acceptedDoc: string;
  @ApiProperty({format: "binary"})
  image: string
}