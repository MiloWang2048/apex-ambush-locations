import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AmbushLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  map: string;

  @Column('double')
  x: number;

  @Column('double')
  y: number;

  @Column({ length: 2000 })
  description: string;
}
