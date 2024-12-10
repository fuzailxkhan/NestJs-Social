import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity'
import {Comment} from '../comment/comment.entity'

@Entity('posts') // Table name
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ length: 100 })
  category: string;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
