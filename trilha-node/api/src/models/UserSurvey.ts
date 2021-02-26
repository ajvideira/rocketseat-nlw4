import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import Survey from './Survey';
import User from './User';

@Entity('users_surveys')
export default class UserSurvey {
  @Column()
  @PrimaryColumn()
  public id: string;

  @Column()
  public user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @Column()
  public survey_id: string;

  @ManyToOne(() => Survey)
  @JoinColumn({ name: 'survey_id', referencedColumnName: 'id' })
  public survey: Survey;

  @Column()
  public value: number;

  @CreateDateColumn()
  public created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
