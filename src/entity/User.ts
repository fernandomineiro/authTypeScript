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
@Unique(["name"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  name: string;

  @Column()
  @Length(4, 2)
  date: string;

  @Column()
  @Length(4, 20)
  email: string;

  @Column()
  @Length(4, 20)
  public_place: string;

  @Column()
  @Length(4, 20)
  number: Number;

  @Column()
  @Length(4, 100)
  complement: string;

  @Column()
  @Length(4, 100)
  district: string;

  @Column()
  @Length(4, 100)
  city: string;

  @Column()
  @Length(4, 100)
  state: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
