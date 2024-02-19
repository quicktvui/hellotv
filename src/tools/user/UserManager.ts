import {App} from "vue";
import {User} from "./User";
import {UserManagerKey} from "./useApi";
import {LoginStatusChangeListener} from "./LoginStatusChangeListener";

export interface UserManager {

    install(app: App): void

    init(...params: any[]): Promise<any>;

    isLogin(): boolean

    getLoginUser(): User | null

    addLoginStatusChangeListener(listener: LoginStatusChangeListener): void

    removeLoginStatusChangeListener(listener: LoginStatusChangeListener): void
}

export function createUserManager(): UserManager {

    let _loginUser: User | null = null

    const listerList: Array<LoginStatusChangeListener> = []

    function init(...params: any[]): Promise<any> {
        return Promise.resolve();
    }

    function isLogin(): boolean {
        return _loginUser !== null
    }

    function getLoginUser() {
        return _loginUser
    }

    function addLoginStatusChangeListener(listener: LoginStatusChangeListener): void {
        const index = listerList.findIndex((l) => l === listener)
        if (index > -1) {
            return;
        }
        listerList.push(listener)
    }

    function removeLoginStatusChangeListener(listener: LoginStatusChangeListener): void {
        const index = listerList.findIndex((l) => l === listener)
        if (index > -1) {
            listerList.splice(index, 1);
        }
    }

    return {
        install: function (app: App) {
            const instance = this
            app.provide(UserManagerKey, instance)
        },
        init,
        isLogin,
        getLoginUser,
        addLoginStatusChangeListener,
        removeLoginStatusChangeListener
    }
}
