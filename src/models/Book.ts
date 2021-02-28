import {Member} from './Member';

export class Book {

    public id: number = -1;
    public title: string = '';
    public author: string = '';
    public price: number = 0;

    public checked_out_to: Member = new Member();
    public liked_by: Member[] = [];
    public owner: Member = new Member();
}