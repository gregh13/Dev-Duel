export default interface Profile {
    avatar_url: string
    bio: string
    props: {
        [index: string]: string | number | Array<string>;
        username: string
        name: string
        location: string
        titles: Array<string>
        'fav language': string
        'total stars': number
        'highest star count': number
        'public repos': number
        'perfect repos': number
        followers: number
        following: number
    }
    prop_styling: {
        [index: string]: string;
        username: string
        name: string
        location: string
        titles: string
        'fav language': string
        'total stars': string
        'highest star count': string
        'public repos': string
        'perfect repos': string
        followers: string
        following: string
    },
    winner: boolean
}