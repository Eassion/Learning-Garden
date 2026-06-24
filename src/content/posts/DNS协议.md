---
title: DNS协议属于哪个层，具体流程是？
date: 2026-06-23
category: 计算机网络
tags:
  - url
  - 浏览器
  - 计算机网络
---

先丢两张图搞清楚为什么网络协议会有不一样的层数。

<img src="https://pica.zhimg.com/v2-2a1c4a0807474a6c20057368b2a637b4_1440w.jpg" title="" alt="" width="394">

<img src="https://pic3.zhimg.com/v2-f2b4ea7b2680bad676641c36a2c57f62_1440w.jpg" title="" alt="" width="408">

看图显而易见，不管是OSI七层还是TCP/IP四层，DNS都在应用层，常用UDP 53端口，因为快，不需要建立连接，但在某些情况下（响应数据太大，UDP放不下或者DNS区域传送）使用TCP

**具体流程：**

#### 1. 浏览器先查自己的 DNS 缓存

用户输入：

```
www.example.com
```

浏览器会先看看自己有没有缓存过这个域名对应的 IP。

如果有，直接使用。

如果没有，继续往下查。

#### 2. 查操作系统 DNS 缓存

浏览器会把解析请求交给操作系统。

操作系统会检查本地 DNS 缓存。

如果系统里有缓存，也可以直接返回 IP。

#### 3. 查 hosts 文件

如果系统缓存也没有，操作系统还会检查 hosts 文件。

hosts 文件可以手动配置域名和 IP 的映射。

例如：

```
127.0.0.1  www.test.com
```

如果 hosts 文件里有对应关系，就直接返回。

#### 4. 请求本地 DNS 服务器

如果本机也找不到，操作系统会请求本地 DNS 服务器。

这个本地 DNS 服务器通常来自：

```
路由器
运营商 DNS
公司内网 DNS
公共 DNS，比如 8.8.8.8、1.1.1.1
```

这一步通常是一个 **递归查询**。

也就是说，客户端会问本地 DNS：

```
请你帮我查一下 www.example.com 的 IP 是什么。
```

本地 DNS 如果自己有缓存，就直接返回。

如果没有，它会继续帮你往下查。

#### 5. 本地 DNS 请求根 DNS 服务器

本地 DNS 服务器先问根 DNS 服务器：

```
www.example.com 的 IP 是什么？
```

根 DNS 服务器一般不会直接告诉你最终 IP。

它会告诉你：

```
我不知道 www.example.com 的具体 IP，但是 .com 顶级域名服务器知道。
```

然后返回 `.com` 顶级域名服务器的地址。

#### 6. 本地 DNS 请求顶级域名服务器

然后本地 DNS 去问 `.com` 顶级域名服务器：

```
www.example.com 的 IP 是什么？
```

`.com` 服务器也通常不会直接给最终 IP。

它会告诉你：

```
我不知道具体的 www.example.com，但是 example.com 的权威 DNS 服务器知道。
```

然后返回 `example.com` 权威 DNS 服务器的地址。

#### 7. 本地 DNS 请求权威 DNS 服务器

最后，本地 DNS 去问 `example.com` 的权威 DNS 服务器：

```
www.example.com 的 IP 是什么？
```

权威 DNS 服务器会返回真正的解析结果，比如：

```
www.example.com → 93.184.216.34
```

#### 8. 本地 DNS 返回给客户端

本地 DNS 拿到 IP 后，会返回给操作系统。

操作系统再返回给浏览器。

浏览器拿到 IP 后，就可以继续后面的流程：

```
建立 TCP 连接→ 如果是 HTTPS，进行 TLS 握手→ 发送 HTTP 请求→ 接收响应→ 渲染页面
```
