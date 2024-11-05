import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne} from "typeorm"
import {Company} from "./Company";
import {User} from "./user";

@Entity()
export class Alert extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    value: string

    @Column()
    shouldBeLower: boolean

    @ManyToOne(() => User, (user) => user.alerts)
    user: User

    @ManyToOne(() => Company, (company) => company.alerts)
    company: Company
}