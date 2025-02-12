import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SupplierEntity } from "./supplier.entity";
import { EntityEnum } from "src/common/enums/entity.enum";

@Entity(EntityEnum.SupplierOtp)
export class supplierOtpEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    code: string;
    @Column()
    expires_in: Date;
    @Column()
    supplierId: number;
    @OneToOne(() => SupplierEntity, (supplier) => supplier.otp, {onDelete: "CASCADE"})
    supplier: SupplierEntity
}