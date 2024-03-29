# 每天一个小知识点

## 第七天

---

## 1、http 相关 204、301、302、304、400、401、403、404 状态码含义？

1、2XX 相关(请求成功)  
200 OK 请求成功  
204 No content 请求成功,但是没有响应体,一定场景下和 200 完全等效,204 会让浏览器有不同的表现,当用户在浏览器窗口 window 或者 frame/iframe 框架中导航的时候,假如返回没有响应体的 200,页面会空白且 URL 也会变成新的 URL,使用 204 时页面不会发生任何变化。<https://www.cnblogs.com/qiqi715/p/9338699.html>  
206 Partial Content 进行范围请求(断点续传有 206)
2、3XX 相关(重定向)  
301 moved permanently 永久重定向  
302 found 临时重定向  
304 not modified 客户端有缓存  
3、4XX 相关(客户端错误)  
400 bad request 请求有语法错误  
401 unauthorized 没有请求权限 (未登录)
403 forbidden 对请求资源的访问被服务器拒绝 (客户端没有权限)
404 not found 请求的资源在服务器未找到

## 2、https 加密过程是怎么样的？

http + 加密 + 认证 + 完整性保护 = https  
HTTP:直接通过明文在浏览器和服务器之间传递信息  
HTTPS:采用对称加密和非对称加密结合的方式来保护浏览器和服务器之间的通信安全  
对称加密算法数据 + 非对称加密算法交换秘钥 + 数字证书验证身份 = 安全  
加密过程:  
![https加密过程](../../public/images/EveryDayKnowledge/https.png)  
相关资料:<https://www.jianshu.com/p/e30a8c4fa329>

## 3、http3 有那些改变？

http3 基于 UDP 协议实现了类似 TCP 的多路复用数据流、传输可靠性等功能,被称为 QUIC 协议  
1、流量控制、传输可靠性功能：QUIC 在 UDP 的基础上增加了一层来保证数据传输可靠性，它提供了数据包重传、拥塞控制、以及其他一些 TCP 中的特性。  
2、集成 TLS 加密功能：目前 QUIC 使用 TLS1.3，减少了握手所花费的 RTT 数。  
3、多路复用：同一物理连接上可以有多个独立的逻辑数据流，实现了数据流的单独传输，解决了 TCP 的队头阻塞问题。  
4、快速握手：由于基于 UDP，可以实现使用 0 ~ 1 个 RTT(返回延时)来建立连接。

## 4、403 和 401 的区别？

401 验证未通过,403 未授权,没有权限访问  
可以理解为,一个未登录(401),一个登陆没有权限(403)
