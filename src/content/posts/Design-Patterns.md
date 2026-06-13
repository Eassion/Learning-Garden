---
title: 常见设计模式
date: 2026-06-13
category: 系统设计
tags:
  - 系统设计
---

通常分为创建型、结构性和行为型三大类

### 1.创建型模式（关注对象的创建）

- **单例模式（Singleton）**

确保全局只有一个实例，常用于全局配置管理、数据库连接池管理，避免重复创建消耗资源。

- **工厂模式**

将对象的创建逻辑封装起来。当需要根据不同的参数创建不同的复杂对象（如不同的支付网关实现：微信、支付宝）时非常有用。

例：根据前端传来的支付类型，动态生成对应的支付处理类

```java
public class PaymentFactory {
    public PaymentService createPayment(String type) {
        if ("WECHAT".equals(type)) {
            return new WechatPayService();
        } else if ("ALIPAY".equals(type)) {
            return new AliPayService();
        }
        throw new IllegalArgumentException("不支持的支付方式");
    }
}
```

- **建造者模式（Builder）**

用于一步步构建复杂的对象。后端在构建复杂的SQL查询语句、组装复杂的API响应实体（如常用的@Builder注解）时经常使用。

例：构建包含大量可选属性的复杂对象，避免构造函数的参数过长，Java常配合Lombok使用。

```java
@Builder
public class User {
    private String username;
    private String password;
    private String email;
    private Integer age;
}

// 业务代码中的使用：链式调用，清晰明了
User user = User.builder()
                .username("zhangsan")
                .email("zs@example.com")
                .build(); // password 和 age 没有传，默认 null
```

### 2.结构型模式（关注类和对象的组合）

- **代理模式（Proxy）**

为其他对象提供一种代理以控制对这个对象的访问。常用于权限校验、日志记录、懒加载等切面操作。

例：在不修改核心业务代码的前提下，增加日志打印或事物控制（这也是Spring @Transactional的底层逻辑）

```java
public class UserServiceProxy implements UserService {
    private UserService target = new UserServiceImpl(); // 被代理的真实对象

    @Override
    public void saveUser() {
        System.out.println("【代理切面】开启数据库事务...");
        target.saveUser(); // 执行核心业务逻辑
        System.out.println("【代理切面】提交数据库事务...");
    }
}
```

- **适配器模式（Adapter）**

将一个类的接口转换成客户希望的另外一个接口。在对接外部第三方API或者整合历史遗留系统时，适配器是必不可少的。

例：老系统只提供返回XML的接口，新系统需要JSON数据

```java
// 目标接口是提供 JSON
public class XmlToJsonAdapter implements JsonProvider {
    private OldXmlSystem oldSystem; // 依赖老系统

    @Override
    public String getJsonData() {
        String xmlData = oldSystem.getXmlData();
        return parseXmlToJson(xmlData); // 在这里做格式转换的“适配”
    }
}
```

**装饰器模式（Decorator）**

动态地给对象添加额外的职责。比如在基础的网络请求流上叠加压缩功能、加密功能。

例：为基础的数据查询服务，动态地加上“缓存功能”

```java
public class CachedDataService implements DataService {
    private DataService basicService; // 被装饰的基础对象

    @Override
    public String queryData() {
        if (checkCacheExists()) {
            return getFromCache();
        }
        // 缓存没有，再调用基础服务去查数据库
        String data = basicService.queryData(); 
        saveToCache(data);
        return data;
    }
}
```

### 3.行为型模式（关注对象间的通信）

- **策略模式（Strategy）**

定义一些列算法，把它们一个个封装起来，并且使它们可以相互替换。非常适用于业务中的多分支判断（如电商中的不同促销折扣计算逻辑），有效替代冗长的if-else。

例：电商结算时，普通会员、vip、svip有不同的折扣计算方式。

#### 场景设定

假设我们有一个电商系统，用户结账时需要计算最终价格，规则如下：

1. **普通用户 (NORMAL):** 原价。

2. **VIP 用户 (VIP):** 打 9 折。

3. **SVIP 用户 (SVIP):** 打 8 折，并且立减 10 元。

#### ❌ 痛点：不用策略模式的“面条式”代码

如果我们顺着直觉写，通常会写出一个包含巨大 `if-else` 的服务类：

```java
@Service
public class OrderService {

    public double calculateFinalPrice(String userType, double originalPrice) {
        if ("NORMAL".equals(userType)) {
            return originalPrice;
        } else if ("VIP".equals(userType)) {
            return originalPrice * 0.9;
        } else if ("SVIP".equals(userType)) {
            return originalPrice * 0.8 - 10;
        } 
        // 🚨 危机出现：
        // 如果下个月老板说加一个“双十一特惠(11_11)”，我们要来改这段代码，加一个 else if
        // 如果再加一个“新用户首单立减”，又要改这段代码...
        // 随着规则越来越多，这个方法会变得极长，稍微改错一个地方，所有人的价格都会算错！

        return originalPrice;
    }
}
```

**问题在于：** 每次新增或修改打折规则，都要修改核心的 `calculateFinalPrice` 方法。这严重违反了面向对象设计中的**开闭原则（对扩展开放，对修改关闭）**。

#### ✅ 破局：使用策略模式 + Spring 自动注入

策略模式的思路是：**把每一个 `if-else` 里面的计算逻辑，单独抽出来变成一个独立的类。**

##### 第一步：定义一个“策略”接口

大家统一遵守这个计算规则的契约。

```java
public interface DiscountStrategy {
    // 所有的打折策略，都必须实现这个计算方法
    double calculate(double originalPrice);
}
```

##### 第二步：将具体的算法写在各自的类中

新增的打折规则互相独立，互不干扰。注意这里我们用 `@Component` 给它们起了别名，这些别名正好对应我们要判断的 `userType`。

```java
// 普通用户策略
@Component("NORMAL")
public class NormalDiscount implements DiscountStrategy {
    @Override
    public double calculate(double price) { 
        return price; 
    }
}

// VIP 策略
@Component("VIP")
public class VipDiscount implements DiscountStrategy {
    @Override
    public double calculate(double price) { 
        return price * 0.9; 
    }
}

// SVIP 策略
@Component("SVIP")
public class SvipDiscount implements DiscountStrategy {
    @Override
    public double calculate(double price) { 
        return price * 0.8 - 10; 
    }
}
```

##### 第三步：见证奇迹（在业务类中调用）

这是 Spring 框架结合策略模式最优雅的写法。Spring 可以自动把所有实现了 `DiscountStrategy` 接口的类，收集到一个 `Map` 里！

```java
@Service
public class OrderService {

    // 💡 Spring 的黑魔法：自动注入所有的策略实现类
    // Key 是 @Component 中定义的名字 (如 "VIP", "SVIP")
    // Value 是对应的策略实现类对象
    @Autowired
    private Map<String, DiscountStrategy> strategyMap;

    public double calculateFinalPrice(String userType, double originalPrice) {

        // 1. 根据传入的用户类型，直接从 Map 里把对应的策略对象“拿”出来
        DiscountStrategy strategy = strategyMap.get(userType);

        if (strategy == null) {
            throw new IllegalArgumentException("未知的用户类型");
        }

        // 2. 执行计算。不用管拿出来的是哪个类，反正它们都有 calculate 方法！
        return strategy.calculate(originalPrice);
    }
}
```

#### 🎯 为什么要绕这么大一圈？（策略模式的收益）

现在，假设下个月老板让你增加一个 **“黑五狂欢(BLACK_FRIDAY) 全场半价”** 的规则，你需要怎么做？

你**完全不需要**去改动 `OrderService` 里面的任何一行老代码！你只需要新建一个类：

```java
@Component("BLACK_FRIDAY")
public class BlackFridayDiscount implements DiscountStrategy {
    @Override
    public double calculate(double price) { 
        return price * 0.5; 
    }
}
```

写完直接重启项目，新的打折规则就生效了。



- **观察者模式（Observer）**

对象间的一对多依赖关系，当一个对象状态改变，所有依赖它的对象都会收到通知。常用于消息发布-订阅（Pub/Sub）、事件驱动架构（如用户注册成功后，同时触发发邮件、发积分的操作）

例：同上，目的是避免核心注册方法串行调用导致及其缓慢

```java
// 业务执行处：只负责“发布”事件
@Service
public class UserService {
    @Autowired
    private ApplicationEventPublisher publisher;

    public void register() {
        // ...执行写入数据库逻辑...
        publisher.publishEvent(new UserRegisterEvent("User123")); // 大喊一声：有人注册啦！
    }
}

// 观察者1：发邮件
@Component
public class EmailListener {
    @EventListener
    public void sendEmail(UserRegisterEvent event) {
         System.out.println("监听到注册，给 " + event.getUserId() + " 发送邮件");
    }
}
```

- **责任链模式**

将请求沿着处理者链进行传递。后端极其常见，如各类拦截器（Interceptor）、过滤器（Filter）、中间件（Middleware）的鉴权和参数校验。

例：Spring MVC 中的过滤器 / 拦截器。一个请求进来，需要依次经过：黑名单过滤 -> Token 鉴权 -> 参数脱敏。

```java
public abstract class Filter {
    protected Filter next; // 指向下一个处理者

    public void setNext(Filter next) { this.next = next; }

    public void doFilter(Request req) {
        process(req); // 当前节点自己的处理逻辑
        if (next != null) {
            next.doFilter(req); // 传递给下一个节点
        }
    }
    protected abstract void process(Request req);
}
```
