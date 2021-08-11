import { login, logout } from '@/api/user'
import { listByTokenApi } from '@/api/loginprocessApi'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        Company_Authorization: getToken(),
        name: '',
        avatar: '',
        taxDiskNum: '',
        taxDiskList: [],
        taxDiskInfo: {}, //税盘信息
        loginInfo: '',
        showLoginWin: false,
        diskIsOnline: '0'

    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.Company_Authorization = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_TAXDISK: (state, taxDiskInfo) => {
        state.taxDiskInfo = taxDiskInfo
    },
    SET_TAXDISKNUM: (state, taxDiskNum) => {
        state.taxDiskNum = taxDiskNum
    },
    SET_LOGININFO: (state, loginInfo) => {
        //state.loginInfo = JSON.parse(JSON.stringify(loginInfo))
        state.loginInfo = loginInfo
    },
    SET_TAXDISKLIST: (state, taxDiskList) => {
        state.taxDiskList = taxDiskList
    },
    showLoginWin: (state, isshow) => {
        state.showLoginWin = isshow
    },
    SET_diskIsOnline: (state, isOn) => {
        state.diskIsOnline = isOn
    }

}

const actions = {
    // user login
    login({ commit }, userInfo, rememberMe) {
        const { userName, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ userName: userName.trim(), password: password }).then(response => {
                if (response.code == 200) {
                    const { data } = response
                    commit('SET_TOKEN', data.access_token)
                    setToken(data.access_token, rememberMe) //需要看下是否选中记住登陆名，传rememberMe是否记住
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    listByTokenApi({ commit }) {
        return listByTokenApi().then((res) => {
            if (res.code == 200) {
                commit('SET_TAXDISKLIST', res.data)
            }
        })
    },
    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
