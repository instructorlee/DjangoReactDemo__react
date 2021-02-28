import Service from "./Service";
import {Book} from "../models/Book";
import {Member} from "../models/Member";

class MemberService extends Service {
    appName = 'member';

    public likeBook = (member: Member, book: Book): Promise<any> => {
        return this._get(`like_book/${member.id}/${book.id}`);
    }
}

export default new MemberService();