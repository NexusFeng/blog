# 每天一个小知识点
## 第七天  
## http相关204、301、302、304、400、401、403、404状态码含义？
1、2XX相关(请求成功)  
200 OK 请求成功  
204 No content 请求成功,但是没有响应体,一定场景下和200完全等效,204会让浏览器有不同的表现,当用户在浏览器窗口window或者frame/iframe框架中导航的时候,假如返回没有响应体的200,页面会空白且URL也会变成新的URL,使用204时页面不会发生任何变化。<https://www.cnblogs.com/qiqi715/p/9338699.html>  
2、3XX相关(重定向)  
301 moved permanently 永久重定向  
302 found 临时重定向  
304 not modified 客户端有缓存  
3、4XX相关(客户端错误)  
400 bad request 请求有语法错误  
401 unauthorized 没有请求权限  
403 forbidden 对请求资源的访问被服务器拒绝
404 not found 请求的资源在服务器未找到
