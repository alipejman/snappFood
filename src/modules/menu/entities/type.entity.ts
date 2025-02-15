import { EntityEnum } from "src/common/enums/entity.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MenuEntity } from "./menu.entity";

@Entity(EntityEnum.MenuType)
export class typeEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    title: string;
    @Column()
    supplierId: number;
    @OneToMany(() => MenuEntity, (food) => food.type)
    items: MenuEntity[];
}