import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne} from "typeorm"
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

    @OneToOne(() => User)
    user: User

    @OneToOne(() => Company)
    company: Company
}