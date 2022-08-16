## rmi

### **request-mock-interceptor**

一个mock响应数据和对请求进行拦截的示例

---

## 功能

### mock响应数据

使用Promise去包装传入的函数,通过配置去改变Promise的返回值


```typescript
examples\mock.ts


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

```

---

### interceptor 根据URL拦截请求，生成响应

通过重写XMLHttpRequest原型链的方法实现

```typescript
examples\interceptor.ts

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

```


## 示例

可以参考仓库examples


