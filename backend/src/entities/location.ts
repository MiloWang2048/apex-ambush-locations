import { IsInt, IsNotEmpty, Length } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  @IsInt()
  id!: number;

  @Column("varchar", { length: 100 })
  @Length(1, 100)
  name!: string;

  @Column("varchar", { length: 100 })
  @Length(1, 100)
  map!: string;

  @Column("varchar", { length: 2000 })
  @Length(1, 2000)
  description!: string;

  @Column("double")
  @IsNotEmpty()
  x!: number;

  @Column("double")
  @IsNotEmpty()
  y!: number;

  @Column("int")
  @IsNotEmpty()
  userId!: number;
}
