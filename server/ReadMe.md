Server Bundle ReadMe
======
The server bundle is a package designated for the control center of the online judge. 
The server has two outstanding parts, the 'daemon' and the 'web app'. They are designed to run independantly of
each other though you may run both within the same physical machine and system.

The document is mostly written in Chinese to aid deployment. It will be translated in time.

服务器大包裹说明：服务器大包裹是一套在线评测平台的控制中心。它分为两个最重要的部分：评测调度伺服器 和 网络界面端。这两部分被设计为可以单独运行互不依赖，
当然你也可以都在同一个服务器上运行。

Set Up 架设
------
For the web and daemon side, you will need a MySQL service installed. It is good practise to have TWO SEPARATE accounts for
the daemon and the web app. The web app should be granted at least **READ-ONLY** access to the following tables

    un_user_meta
    un_problems_meta

and **READ+WRITE** access to

    un_user
    un_problems
	
The daemon user should be granted full access (READ+WRITE) to all tables required in the db.

架设服务器大包裹时，你要保证有一台MySQL服务器。其中应该为 daemon 和 web **分别建立用户** 并控制权限。web 端只需要拥有以下数据库（见上方区域1）的 **只读** 权利，和上方区域2的读写权利。
daemon 应该拥有全数据库的读写权利。

Configuration 配置服务器
------
- 分解模式 Split Mode

    分解模式是指在 **两台** 不同的服务器上分别运行 评测调度伺服器 和 网络界面。配置时参考如下配置方式：
    
    服务器1: daemon
    服务器2: web
    
    两台服务器在同一个域内。
    
    - 修改 daemon 的 config.js
        
        分别配置：
        controlPort 为开放的控制端口
        controlEncrypted 为是否加密
        controlKey 如果加密使用的钥匙
        
    - 修改 web 的 config.js
    
        分别配置：
        judgment.server 为 daemon 的相对IP
        judgment.port 为 daemon 配置的 controlPort
        如果设定了 daemon 的 controlEncrypted 则要设置
        judgment.key 为相应的 controlKey，否则请保持 judgment.key 为 null
        
    测试：首先确保两服务器都在正确运行没有抛出错误，然后请登 web 服务端的 admin用户进入后台管理，访问 `http://<your.server>/admin/api/serverfwd` 你就能获得 daemon 联动的状态信息。
    
    如果输出： {"status":503, "msg":"Service Unavailable. Status server down or not configured properly."} 则说明
    服务器配置的有问题，请检查配置是否按照上方设定，比如key是否都正确。同时，要保证由 web 端可以 ping 到并可访问 daemon 机器。可以在 web 端机器上尝试运行 
    `wget -q -O - http://<your.daemon.server>:<port>/server` 来测试一下是否可访问
    
    如果提输出： {"server_name":"shikieiki","node_version":"v0.10.15","server_arch":"linux x64"}
    则表示目前联动正常！灰常不错！

- 合并模式 Combined System

    合并模式的配置与分散模式类似，只是daemon和web被安装在同一台机器上。这时 web 的 judgment.server 则填写 127.0.0.1 即可。
    注意：建议把 daemon 和 web 安装为两个独立的用户来增加安全度。
    注意2：记得不要让 daemon 的 controlPort 与 web 的 config 的 port 一致否则会撞车导致无法启动 web 端。
    
    


