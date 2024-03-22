import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/user.service';
import Profile from '../models/Profile';

@Component({
  selector: 'app-duel',
  templateUrl: './duel.component.html',
  styleUrls: ['./duel.component.css']
})

export class DuelComponent implements OnInit {
  errorMessage: string = "";
  usernameOne: string = "";
  usernameTwo: string = "";
  userProfiles: Profile[] = []

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.updateUserProfiles([]);
    this.userService.userProfilesObservable.subscribe(profiles => this.userProfiles = profiles)
  }

  receiveUsernameOne(valueEmitted: string) {
    this.usernameOne = valueEmitted;
  }

  receiveUsernameTwo(valueEmitted: string) {
    this.usernameTwo = valueEmitted;
  }

  onSubmit() {
    if (!this.usernameOne || !this.usernameTwo) {
      this.userService.updateUserProfiles([]);
      this.errorMessage = "**Please provide two GitHub usernames to duel";
    } else {
      this.userService.duelUsers(this.usernameOne, this.usernameTwo)
        .then(profiles => {
          if (profiles.length > 0) {
            this.errorMessage = "";
            this.userService.updateUserProfiles(profiles);
          } else {
            this.userService.updateUserProfiles([]);
            this.errorMessage = `Sorry, we couldn't find one or both users "${this.usernameOne}" / "${this.usernameTwo}" on GitHub`;
          }
        });
    }
  }
}
