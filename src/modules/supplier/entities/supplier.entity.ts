import { EntityEnum } from "src/common/enums/entity.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { supplierOtpEntity } from "./supplier-otp.entity";

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
  @Column()
  invite_code: string;
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
}
