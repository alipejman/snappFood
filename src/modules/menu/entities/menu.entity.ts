import { EntityEnum } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { typeEntity } from "./type.entity";
import { MenuFeedbackEntity } from "./feedback.entity";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { SupplierEntity } from "src/modules/supplier/entities/supplier.entity";

@Entity(EntityEnum.Menu)
export class MenuEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    name: string;
    @Column()
    image: string;
    @Column()
    key: string;
    @Column({ default: true })
    is_active: boolean;
    @Column({type: "double"})
    price: number;
    @Column({type: "double", default: 0})
    discount: number;
    @Column()
    description: string;
    @Column({type: "double", default: 0})
    score: number;
    @Column()
    typeId: number;
    @Column()
    supplierId: number;
    @ManyToOne(() => typeEntity, (type) => type.items)
    type: typeEntity;
    @OneToMany(() => MenuFeedbackEntity, (feedbacks) => feedbacks.food)
    feedbacks: MenuFeedbackEntity[];
    @OneToMany(() => BasketEntity, (basket) => basket.food)
    basket: BasketEntity[]
    @ManyToOne(() => SupplierEntity, (supplier) => supplier.food, {onDelete: "CASCADE"})
    supplier: SupplierEntity;
}
