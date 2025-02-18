import { EntityEnum } from "src/common/enums/entity.enum";
import { BasketEntity } from "src/modules/basket/entities/basket.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity(EntityEnum.Discount)
export class DiscountEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    code: string;
    @Column({type: "double", nullable: true})
    percent:number;
    @Column({type: "double", nullable: true})
    amount: number;
    @Column({nullable: true})
    expires_in: Date;
    @Column()
    limit: number;
    @Column()
    usage: number;
    @Column({nullable: true})
    supplierId: number;
    @Column({default: true})
    active: boolean;
    @OneToMany(() => BasketEntity, (basket) => basket.discount)
    baskets: BasketEntity[];
}
