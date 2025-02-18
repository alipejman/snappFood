import { EntityEnum } from "src/common/enums/entity.enum";
import { DiscountEntity } from "src/modules/discount/entities/discount.entity";
import { MenuEntity } from "src/modules/menu/entities/menu.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityEnum.UserBasket)
export class BasketEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    userId: number;
    @Column({nullable: true})
    foodId: number;
    @Column({nullable: true})
    count: number;
    @Column({nullable: true})
    discountId: number;
    @ManyToOne(() => UserEntity, (user) => user.basket, {onDelete:"CASCADE"})
    user: UserEntity;
    @ManyToOne(() => MenuEntity, (food) => food.basket, {onDelete: "CASCADE"})
    food: MenuEntity;
    @ManyToOne(() => DiscountEntity, (discount) => discount.baskets, {onDelete: "CASCADE"})
    discount: DiscountEntity;
}
