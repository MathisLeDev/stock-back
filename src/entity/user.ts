import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, ManyToOne, OneToMany} from "typeorm"
import {Alert} from "./alert";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    password: string

    @Column()
    email: string

    @OneToMany(() => Alert, (alert) => alert.user)
    alerts: Alert[]

}