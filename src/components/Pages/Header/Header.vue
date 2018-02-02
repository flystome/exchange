<template>
  <div class="navbar-Home">
     <header class="container navbar navbar-static-top clearfix" role="navigation">
     <ul class="nav nav-pills navbar-header">
      <li role="presentation"><a href="#">主页</a></li>
      <li role="presentation"><a href="#">交易</a></li>
      <li role="presentation" class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
          IFO分叉 <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </li>
    </ul>
    <ul class="nav navbar-nav navbar-right nav-margin">
    请<router-link :to='"/login"'>登录</router-link>或<router-link :to='"/register"'>注册</router-link>后操作
    </ul>
  </header>
  </div>
</template>

<style lang='css'>
@import './index.css'
</style>
