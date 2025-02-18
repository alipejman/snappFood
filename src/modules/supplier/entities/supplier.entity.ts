import { EntityEnum } from "src/common/enums/entity.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { supplierOtpEntity } from "./supplier-otp.entity";
import { supplierStatus } from "src/common/enums/supplier.enum";
import { MenuEntity } from "src/modules/menu/entities/menu.entity";
import { typeEntity } from "src/modules/menu/entities/type.entity";

@Entity(EntityEnum.Supplier)
export class SupplierEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  phone: string;
  @Column()
  manager_name: string;
  @Column()
  manager_family: string;
  @Column()
  store_name: string;
  @Column({ nullable: true })
  categoryId: number;
  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, {
    onDelete: "SET NULL",
  })
  category: CategoryEntity;
  @Column()
  city: string;
  @Column({nullable: true})
  image: string;
  @Column({nullable: true})
  document: string;
  @Column({nullable: true})
  invite_code: string;
  @Column({nullable: true})
  national_code: string;
  @Column({nullable: true})
  email: string;
  @Column({nullable: true, default: supplierStatus.Registered})
  status: string;
  @Column({nullable:true, default:false, type: Boolean})
  mobile_verify: boolean;
  @Column({nullable: true})
  agentId: number;
  @OneToMany(() => SupplierEntity, (supplier) => supplier.agent)
  agent: SupplierEntity;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.subsets)
  subsets: SupplierEntity[];
  @Column({nullable: true})
  otpId: number;
  @OneToOne(() => supplierOtpEntity, (otp) => otp.supplier)
  @JoinColumn()
  otp: supplierOtpEntity;
  @OneToMany(() => typeEntity, (type) => type.supplier)
  menuType: typeEntity[]
  @OneToMany(() => MenuEntity, (food) => food.supplier)
  food: MenuEntity[]
}
