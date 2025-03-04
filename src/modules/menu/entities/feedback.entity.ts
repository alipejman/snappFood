import { EntityEnum } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MenuEntity } from "./menu.entity";

@Entity(EntityEnum.MenuFeedback)
export class MenuFeedbackEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    userId: number;
    @Column()
    foodId: number;
    @Column()
    score: number;
    @Column()
    comment: string;
    @ManyToOne(() => UserEntity, (user) => user.feedbacks, {onDelete: "CASCADE"})
    user: UserEntity;
    @ManyToOne(() => MenuEntity, (food) => food.feedbacks, {onDelete: "CASCADE"})
    food: MenuEntity;
}