head插入
<!-- 默认 HEAD 部分 -->
<link rel="stylesheet" type="text/css" href="https://@@cdn_domain/cop/as-lib/0.0.2/hybridcloud.min.css?t=@@timeStamp"></link>
<link rel="stylesheet" type="text/css" href="https://@@cdn_domain/cop/as-lib/0.0.2/teamix-pro.min.css?t=@@timeStamp"></link>
<link rel="stylesheet" type="text/css" href="//@@cdn_domain/bizbase/interceptor/0.0.1/TeamixInterceptor.css?t=@@timeStamp"></link>
<link rel="stylesheet" type="text/css" href="https://@@cdn_domain/cop/uni-common/0.1.0/UniCommon.css?t=@@timeStamp"></link>

<link href="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/css/app.css?t=@@timeStamp" rel="preload" as="style" />
<link href="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/css/chunk-vendors.css?t=@@timeStamp" rel="preload" as="style" />
<link href="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/js/app.js?t=@@timeStamp" rel="preload" as="script" />
<link href="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/js/chunk-vendors.js?t=@@timeStamp" rel="preload" as="script" />
<link href="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/css/chunk-vendors.css?t=@@timeStamp" rel="stylesheet" />
<link href="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/css/app.css?t=@@timeStamp" rel="stylesheet" />

<!--吊顶css-->
<link href="https://@@cdn_domain/teamix-components/teamix-nav-console/0.0.1/dist/consolenavcdnall.css?t=@@timeStamp" rel="stylesheet" />


body插入
<!-- 默认 BODY 部分 -->
<script>
  // 这一部分请更改为业务 JS 需要的 public_path
  window.__asconsole_webpack_public_path__ = "https://@@cdn_domain/mse/harmony-gateway-ui/@@version/";
  
  window.ONECONSOLE_PRODUCT_NAME = "cop";
   window.ALIYUN_CONSOLE_NAV_CONFIG = {
        product: 'ascm',
        identifier: 'cop', // 必填，产品 identifier 标识
        isCellRegion: !Boolean(window.AS_CONSOLE_CONFIG.IS_CENTER_REGION), // portal 是否部署在单元 region，单元为 true，中心为 false
  };
  
</script>
<script type="text/javascript" src="https://@@cdn_domain/cop/as-lib/0.0.2/react-all-with-polyfill.min.js?t=@@timeStamp"></script>
<script type="text/javascript" src="https://@@cdn_domain/cop/as-lib/0.0.2/material.min.js?t=@@timeStamp"></script>
<script type="text/javascript"src="https://@@cdn_domain/bizbase/interceptor/0.0.1/TeamixInterceptor.js?t=@@timeStamp"></script>

<!--吊顶JS-->
<script src="https://@@cdn_domain/teamix-components/teamix-nav-console/0.0.1/dist/consolenavcdnall.js?t=@@timeStamp"></script>
<script src="https://@@cdn_domain/cop/service-loader/0.1.0/modules/TeamixServiceUI.js?t=@@timeStamp"></script>
<script src="https://@@cdn_domain/cop/service-loader/0.1.0/modules/TeamixServiceUtils.js?t=@@timeStamp"></script>
<script src="https://@@cdn_domain/cop/uni-common/0.1.0/UniCommon.js?t=@@timeStamp"></script>

<div id="app"></div>
<script src="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/js/chunk-vendors.js?t=@@timeStamp"></script>
<script src="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/static/js/app.js?t=@@timeStamp"></script>
<script src="https://@@cdn_domain/mse/harmony-gateway-ui/@@version/vendor/cross-fetch.js?t=@@timeStamp"></script>
<script>
    console.log('checkSSL')
</script>

