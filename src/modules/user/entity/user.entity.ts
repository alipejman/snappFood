import { EntityEnum } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AddressEntity } from "./address.entity";
import { OTPEntity } from "./otp.entity";
import { MenuFeedbackEntity } from "src/modules/menu/entities/feedback.entity";

@Entity(EntityEnum.User)
export class UserEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column({nullable: true})
    first_name: string;
    @Column({nullable: true})
    last_name: string;
    @Column({unique: true})
    mobile: string;
    @Column({nullable: true, unique: true})
    email: string;
    @Column({nullable: true})
    invite_code: string;
    @Column({default: 0})
    score: number;
    @Column({nullable: true})
    agentId: number;
    @Column({nullable: true})
    otpId: number;
    @OneToOne(() => OTPEntity, (otp) => otp.user)
    @JoinColumn()
    otp: OTPEntity;
    @Column({nullable: true, default: false})
    mobile_verify: boolean;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @OneToMany(() => AddressEntity, (address) => address.user)
    addressList: AddressEntity[];
    @OneToMany(() => MenuFeedbackEntity, (feedbacks) => feedbacks.user)
    feedbacks: MenuFeedbackEntity[];
}