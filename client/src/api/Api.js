import axios from 'axios'
class Api {
    static setNickname(nickname, callback){
        axios.post('http://localhost:3000/setNickname', {'nickname':nickname})
            .then((res) =>{
                callback(null, res.data)
            })
            .catch((err) => {
                callback(err, null);
            });
    }

    static getUsers(callback){
        return axios.get('http://localhost:3000/getUsers')
            .then((res) =>{
                callback(null, res.data)
            })
            .catch((err) => {
                callback(err, null);
            });
    }
}

export default Api

