import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import { EntityEnum } from "src/common/enums/entity.enum";

@Entity(EntityEnum.UserOtp)
export class OTPEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  code: string;
  @Column()
  expires_in: Date;
  @Column()
  userId: number;
  @OneToOne(() => UserEntity, (user) => user.otp, {onDelete: "CASCADE"})
  user: UserEntity;
}
 