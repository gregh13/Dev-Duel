import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import ProfileRaw from './app/models/ProfileRaw';
import Profile from './app/models/Profile';

const inspectUserUrl = 'http://localhost:3000/api/user/';
const duelUsersUrl = 'http://localhost:3000/api/users?';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userProfilesSource = new BehaviorSubject<Profile[]>([]);
  userProfilesObservable = this.userProfilesSource.asObservable();

  constructor(private http: HttpClient) { }

  updateUserProfiles(profiles: Profile[]) {
    this.userProfilesSource.next(profiles);
  }

  async inspectUser(username = 'andrew'): Promise<Profile[]> {
    try {
      let data = await lastValueFrom(this.http.get<ProfileRaw>(inspectUserUrl + username));
      return this.transformProfileTypes([data]);
    }
    catch (err) {
      console.log("Error message: ", err);
      console.log({
        "error": err,
        "tips": `The user ${username} was not found on GitHub`
      });
      return [];
    }
  }

  async duelUsers(user1 = 'fabpot', user2 = 'andrew'): Promise<Profile[]> {
    try {
      let data = await lastValueFrom(this.http.get<ProfileRaw[]>(duelUsersUrl + `username=${user1}&username=${user2}`));
      return this.compareProfiles(this.transformProfileTypes(data));
    }
    catch (err) {
      console.log("Error message: ", err);
      console.log({
        "error": err,
        "tips": `One or both of the users "${user1}/${user2}" could not be found on GitHub`
      });
      return [];
    }
  }

  transformProfileTypes(rawProfiles: ProfileRaw[]): Profile[] {
    const profiles: Profile[] = [];
    for (let profile of rawProfiles) {
      const newProfile = {
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        props: {
          username: profile.username,
          name: profile.name,
          location: profile.location,
          titles: profile.titles,
          "fav language": profile["favorite-language"],
          "total stars": profile["total-stars"],
          "highest star count": profile["highest-starred"],
          "public repos": profile["public-repos"],
          "perfect repos": profile["perfect-repos"],
          followers: profile.followers,
          following: profile.following
        },
        prop_styling: {
          username: "",
          name: "",
          location: "",
          titles: "",
          'fav language': "",
          'total stars': "",
          'highest star count': "",
          'public repos': "",
          'perfect repos': "",
          followers: "",
          following: "",
        },
        winner: false
      };
      profiles.push(newProfile);
    }
    return profiles;
  }

  compareProfiles(profiles: Profile[]): Profile[] {
    const profileOne: Profile = profiles[0];
    const profileTwo: Profile = profiles[1];

    for (let prop in profileOne.props) {
      let propOneValue = profileOne.props[prop]; 
      let propTwoValue = profileTwo.props[prop];

      if (typeof propOneValue === "number" && typeof propTwoValue === "number") {
        if (propOneValue !== propTwoValue) {
            profileOne.prop_styling[prop] = propOneValue < propTwoValue ? "less" : "more";
            profileTwo.prop_styling[prop] = propTwoValue < propOneValue ? "less" : "more";
        }
      } else if (typeof propOneValue === "string" && typeof propTwoValue === "string") {
        if (propOneValue !== propTwoValue) {
          if (propOneValue) {
            profileOne.prop_styling[prop] = "different";
          }
          if (profileTwo) {
            profileTwo.prop_styling[prop] = "different";
          }
        }
      } else if (typeof propOneValue === "object" && typeof propTwoValue === "object") {
        if (!this.areTitlesEqual(propOneValue, propTwoValue)) {
            profileOne.prop_styling[prop] = propOneValue.length > 0 ? "different": "";
            profileTwo.prop_styling[prop] = propTwoValue.length > 0 ? "different": "";
        }
      } else if (typeof propOneValue !== typeof propTwoValue) {
        if (typeof propOneValue == "string"){
          profileOne.prop_styling[prop] = "different";
        }
        if (typeof propTwoValue === "string"){
          profileTwo.prop_styling[prop] = "different";
        }
      }
    }

    // Decide winner
    const starsOne = profileOne.props['total stars'];
    const starsTwo = profileTwo.props['total stars'];

    if (starsOne === starsTwo) {
      // Tie, auto declare userOne the winner
      profileOne.winner = true;
    } else {
      profileOne.winner = starsOne > starsTwo ? true : false;
      profileTwo.winner = starsTwo > starsOne ? true : false;
    }

    return [profileOne, profileTwo];
  }


  areTitlesEqual(arr1: Array<string>, arr2: Array<string>): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }
}
