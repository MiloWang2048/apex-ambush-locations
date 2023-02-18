import { IsEmail, IsInt } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @IsInt()
  id!: number;

  @Column("varchar", { length: 100 })
  @IsEmail()
  email!: string;
}
