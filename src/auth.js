import ajax from './utils.js'

export default {

    async login(formData) {
        return await ajax.ajax({
            type: "POST",
            url: "/api/login",
            data: JSON.stringify(formData),
            success: function (data) {
                let arr = data.token.split(".")
                let decoded = atob(arr[1])
                let json = JSON.parse(decoded);
                json['token'] = data.token
                localStorage.setItem("user-profile", JSON.stringify(json));
            },
            dataType: "json",
            contentType: "application/json"
        });
    },

    userName() {
        let jsonStr = localStorage.getItem('user-profile')
        if(!jsonStr) {
            return "n/a"
        }
        return JSON.parse(jsonStr).userName
    },
    userId() {
        let jsonStr = localStorage.getItem('user-profile')
        if(!jsonStr) {
            return "n/a"
        }
        return JSON.parse(jsonStr).userId
    },
    companyId() {
        let jsonStr = localStorage.getItem('user-profile')
        if(!jsonStr) {
            return "n/a"
        }
        return JSON.parse(jsonStr).companyId
    },
    companyName() {
        let jsonStr = localStorage.getItem('user-profile')
        if(!jsonStr) {
            return "n/a"
        }
        return JSON.parse(jsonStr).companyName
    },
    role() {
        let jsonStr = localStorage.getItem('user-profile')
        if(!jsonStr) {
            return "n/a"
        }
        return JSON.parse(jsonStr).role
    },
    token() {
        let jsonStr = localStorage.getItem('user-profile')
        if(!jsonStr) {
            return "n/a"
        }
        return JSON.parse(jsonStr).token
    },

    authHeader() {
        let jsonStr = localStorage.getItem('user-profile')
        if(!jsonStr) {
            return "n/a"
        }
        return { 'Authorization': 'Bearer ' + JSON.parse(jsonStr).token }
    },
    logout() {
        localStorage.removeItem('user-profile');
    }
}