export default interface ProfileRaw {
    username: string,
    name: string
    location: string
    titles: Array<string>
    'favorite-language': string
    'total-stars': number
    'highest-starred': number
    'public-repos': number
    'perfect-repos': number
    followers: number
    following: number
    bio: string
    'avatar_url': string
}