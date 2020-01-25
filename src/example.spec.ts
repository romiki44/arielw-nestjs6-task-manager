// vylucene z testov v package.json!!
// "testPathIgnorePatterns" : [
//  "<rootDir>/example.spec.ts" 
//]
 
import { AppModule } from './app.module';
describe('my test', ()=> {
  it('returns true', ()=>{
    expect(true).toEqual(true);
  })
});

class FriendsList {
  friends=[];

  addFriend(name) {
    this.friends.push(name);
    this.announceFrinedship(name);
  }

  announceFrinedship(name) {
    console.log(`${name} is now a friend!`);
  }

  removeFriend(name) {
    const index=this.friends.indexOf(name);
    if(index<0) {
      throw new Error('Friend not found');
    }
    this.friends.splice(index, 1);
  }
}

describe('FriendsList', ()=>{
  let friendsList;
  
  beforeEach(()=>{
    friendsList=new FriendsList();
  });

  it('initializes friends list', ()=> {
    //const friendsList=new FriendsList();
    
    expect(friendsList.friends.length).toEqual(0);
  });

  it('add friend to friends list', ()=> {
    //const friendsList=new FriendsList();
    friendsList.addFriend('Tom');
    
    expect(friendsList.friends.length).toEqual(1);
  });

  it('announce friendship', ()=> {
    //const friendsList=new FriendsList();
    friendsList.announceFrinedship=jest.fn(); //mock fn

    expect(friendsList.announceFrinedship).not.toHaveBeenCalled();
    friendsList.addFriend('Tom');
    expect(friendsList.announceFrinedship).toHaveBeenCalledWith('Tom');
  });

  describe('remove friend', ()=> {
    it('remove friend from list', ()=> {
      friendsList.addFriend('Tom');
      expect(friendsList.friends[0]).toEqual('Tom');
      friendsList.removeFriend('Tom');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('throw an Error if friend not exist in list', ()=>{
      expect(()=>friendsList.removeFriend('Tom')).toThrow(new Error('Friend not found'));
    });
  });
})