import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, ManyToOne} from "typeorm"
import {Alert} from "./alert";

@Entity()
export class Company extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    name: string

    @OneToMany(() => Alert, (alert) => alert.user, {nullable: true})
    alerts: Alert[];
}