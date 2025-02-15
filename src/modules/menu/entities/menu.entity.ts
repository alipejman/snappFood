import { EntityEnum } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { typeEntity } from "./type.entity";
import { MenuFeedbackEntity } from "./feedback.entity";

@Entity(EntityEnum.Menu)
export class MenuEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    name: string;
    @ManyToOne(() => typeEntity, (type) => type.items)
    type: typeEntity;
    @OneToMany(() => MenuFeedbackEntity, (feedbacks) => feedbacks.food)
    feedbacks: MenuFeedbackEntity[];
}
