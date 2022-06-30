import {BaseEntity, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;
}
