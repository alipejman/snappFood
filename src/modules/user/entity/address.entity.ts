import { EntityEnum } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityEnum.Address)
export class AddressEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    title: string;
    @Column()
    provience: string;
    @Column()
    city: string;
    @Column()
    address: string;
    @Column({nullable: true})
    postal_code: string;
    @Column()
    userId: number;
    @CreateDateColumn()
    created_at: Date;
    @ManyToOne(() => UserEntity, user => user.addressList, {onDelete: "CASCADE"})
    user: UserEntity;


}