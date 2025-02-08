import { EntityEnum } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AddressEntity } from "./address.entity";

@Entity(EntityEnum.User)
export class UserEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column({nullable: true})
    first_name: string;
    @Column({nullable: true})
    last_name: string;
    @Column()
    mobile: string;
    @Column()
    email: string;
    @Column({nullable: true})
    invite_code: string;
    @Column({default: 0})
    score: number;
    @Column({nullable: true})
    agentId: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @OneToMany(() => AddressEntity, address => address.user)
    addressList: AddressEntity[];
}