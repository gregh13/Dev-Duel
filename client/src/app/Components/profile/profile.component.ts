import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Profile from 'src/app/models/Profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input() profile: Profile | undefined = undefined;

  constructor() {}

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['profiles']) {
  //     this.updateProfiles(this.profiles);
  //   }
  // }

  ngOnInit(): void {}

  // Used to preserve order of object keys in ngFor
  returnZero = () => 0;

}
