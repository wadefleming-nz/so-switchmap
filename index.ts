import { of, Observable } from 'rxjs'; 
import { map, flatMap, switchMap, toArray } from 'rxjs/operators';

interface Jobby{
  id: number;
  idJobber: number;
  idSeeker: number;
}

interface User{
  name: string;
}

interface JobbyAndUser{
  id: number;
  user: User;
}

class ResponseQuizes{
  jobbys = [{id: 1, idJobber: 1, idSeeker: 1},{ id: 2, idJobber:2, idSeeker: 2}];
  snapshotChanges(): Observable<Jobby[]>{
    return of(this.jobbys)
  }
}

class UserService{
  users = {1: 'Jim', 2:'Bob'};
  getUserById(id: number) : Observable<User> {
    return of({ name: this.users[id]});
  }
}

class Main{
  responseQuizes = new ResponseQuizes();
  userService = new UserService();

  quizes: Observable<JobbyAndUser[]> = this.responseQuizes.snapshotChanges().pipe(
    flatMap(jobbys => jobbys),    // map array to single values
    switchMap(jobby =>            // use switchmap to handle subsciption to user service observable
      this.userService.getUserById(jobby.idJobber).pipe(map(user => ({id: jobby.id, user})),
       toArray()),                // convert from single values back to array
  ));
}

const main = new Main();
main.quizes.subscribe(console.log);

