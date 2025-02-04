import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AddressEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    title: string;
    @Column()
    address: string;
    @Column()
    detail: string;
    @Column()
    phone: string;
}