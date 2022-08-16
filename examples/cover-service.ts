/*
 * @Author: wangzhisen 
 * @Date: 2022-08-16 15:04:26 
 * @Last Modified by: wangzhisen
 * @Last Modified time: 2022-08-16 17:02:48
 * 
 * 运行原有的service，通过coverService选项去修改值
 */

import {adaptor} from '../src'

const resolvedService = () => Promise.resolve({
    name:"xiaoming",
    age:25
})

const rejectedService = () => Promise.reject("404 NOT FOUND")

/**通过函数方式操作原有的Promise结果 */
const coverResolve= adaptor(resolvedService,{
    coverService:(data,err) => {
        return {
            ...data,
            name:"Jim"
        }
    },
})

const coverRejected = adaptor(rejectedService,{
    coverService:(data,err) => {
        return `${err} override`
    },
})

coverResolve().then(data => {
    console.log("coverResolve result",data)
})

coverRejected().catch(reason => {
    console.log("coverRejected result",reason)
})