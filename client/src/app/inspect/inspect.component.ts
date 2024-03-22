import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/user.service';
import Profile from '../models/Profile';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.css']
})
export class InspectComponent implements OnInit{

  errorMessage: string = "";
  username: string = ""
  userProfiles: Profile[] = []

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.updateUserProfiles([]);
    this.userService.userProfilesObservable.subscribe(profiles => this.userProfiles = profiles)
  }

  receiveUsername(valueEmitted: string) {
    this.username = valueEmitted;
  }
    
  onSubmit() {
    if (!this.username) {
      this.errorMessage = "**Please provide a GitHub username to inspect";
    } else {
      this.userService.inspectUser(this.username)
      .then( profiles => {
        if (profiles.length > 0) {
          this.errorMessage = "";
          this.userService.updateUserProfiles(profiles);
        } else {
          this.userService.updateUserProfiles([]);
          this.errorMessage = `Sorry, we couldn't find the user "${this.username}" on GitHub`;
        }
      });
    }
  }
}
