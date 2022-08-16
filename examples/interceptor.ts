/*
 * @Author: wangzhisen 
 * @Date: 2022-08-16 15:59:12 
 * @Last Modified by: wangzhisen
 * @Last Modified time: 2022-08-16 17:00:48
 * 
 * 使用拦截器处理请求
 */

import {Interceptor} from '../src'
import {Method} from '../typing'

new Interceptor({
    rules:[
        {
            url:"/api/ping",
            cover:"api 500 success"
        },
        {
            url:"/api",
            cover:"api 404 success"
        },
    ]
})

const ajax = (url:string,method:Method,data?:any) => {
    return new Promise((resolve,reject) => {
        let xhr = new window.XMLHttpRequest()
        xhr.open(url,method)
        xhr.onreadystatechange = function() {
            console.log(url, xhr.readyState, xhr.status)
            if (xhr.readyState === 4) { 
                if (xhr.status >= 200 && xhr.status <= 400) {
                    resolve(xhr.response)
                }
                else {
                    reject()
                }
            }
        }
    
        xhr.send(data)
    })
    
}

ajax("http://localhost:80/api/404/hello","GET").then(data => {
    console.log("data",data)
})

ajax("http://localhost:80/api/ping","GET").then(data => {
    console.log("data",data)
}).catch(error => {
    console.log("error",error)
})