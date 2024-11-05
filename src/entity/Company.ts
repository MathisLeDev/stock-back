import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany} from "typeorm"
import {Alert} from "./alert";

@Entity()
export class Company extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Alert, (alert) => alert.user)
    alerts: Alert[];
}