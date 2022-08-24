import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["title"])
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  title: string;

  @Column()
  @Length(4, 2)
  category: string;

  @Column()
  @Length(4, 20)
  pagination: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
