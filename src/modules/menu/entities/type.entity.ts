import { EntityEnum } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MenuEntity } from "./menu.entity";
import { SupplierEntity } from "src/modules/supplier/entities/supplier.entity";

@Entity(EntityEnum.MenuType)
export class typeEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    title: string;
    @Column()
    supplierId: number;
    @Column({default: 0})
    priority: number;
    @OneToMany(() => MenuEntity, (food) => food.type)
    items: MenuEntity[];
    @ManyToOne(() => SupplierEntity, (supplier) => supplier.menuType)
    supplier: SupplierEntity;
}