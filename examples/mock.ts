/*
 * @Author: wangzhisen 
 * @Date: 2022-08-16 15:02:12 
 * @Last Modified by: wangzhisen
 * @Last Modified time: 2022-08-16 15:06:34
 * 
 * 使用adaptor包裹请求的函数，通过传入选项,对结果进行转化
 */

import {adaptor} from '../src'

const service = () => Promise.resolve(200)

/**模拟另外一个请求成功的数据  mockSuccessService: () => Promise<{result:2000}>*/
const mockSuccessService = adaptor<number>(service,{
    result:2000
})

mockSuccessService().then(data => {
    console.log("success",data)
})

/**模拟请求失败的数据 () => Promise<never>*/
const mockFailService = adaptor<any,string>(service,{
    success:false,
    reason:"Reject 404"
})

mockFailService()
.catch(reason => {
    console.log("fail catch",reason)
})