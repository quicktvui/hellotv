import {User} from "./User";

export interface LoginStatusChangeListener {

    onLogin(user: User | null)

    onLogout(user: User | null)
}
