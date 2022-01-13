// ==UserScript==
// @name         SandBox 抢地时自动点击购买按钮，请配合咱们的定制小狐狸钱包使用
// @namespace    https://github.com/zhangshengjie/TheSandBox_autoClick
// @version      0.2
// @description  自动点击sandbox购买按钮
// @author       cejay
// @match        https://www.sandbox.game/*
// @icon         https://www.sandbox.game/favicon-96x96.png
// @grant        none
// ==/UserScript==



var running = false;
var buyBtnKey = 'SAND';
var buyBtnKey_debug = 'Bid';
var isDebug = false;
var infoNode = null;
var clickCount = 0;
var currentBtnClickTimes = 0;


function showStatus(str){
    try{
        if(infoNode){
            if(infoNode.getClientRects().length===0){
                infoNode = null;
            }
        }
        if(!infoNode){
            infoNode = document.getElementById('__infonode__');
            if(!infoNode){
                let infoNodeDom=document.createElement("div");
                infoNodeDom.id='__infonode__';
                let navbar = document.getElementsByClassName('navbar');
                if(navbar && navbar.length>0){
                    navbar[0].appendChild(infoNodeDom);
                    infoNode = document.getElementById('__infonode__');

                    infoNode.style.height = "100%";
                    infoNode.style.alignItems = "center";
                    infoNode.style.display = "flex";
                }
            }
        }
        if(infoNode){
            infoNode.innerText = str || '自动点击付款插件已经运行，请配合咱们的定制版小狐狸钱包一起使用';
        }
    }catch(ex){
        console.log(ex);
    }
}


function run() {
    if (running) {
        return;
    }
    running = true;
    let clicked = false;

    try {
        const footers = document.getElementsByClassName('footer');
        if (footers && footers.length === 1) {
            const btns = (footers[0]).getElementsByTagName('button');
            if (btns && btns.length > 0) {
                for (let btn of btns) {
                    const txt = btn.innerText;
                    if (txt && txt.includes((isDebug ? buyBtnKey_debug: buyBtnKey))) {
                        if(currentBtnClickTimes % 2 === 0){
                            //第一次点击或者后续需要点击,此处目的是希望每次按钮刚刚出现时点击速度要足够快，但是同一个按钮不变化是稍微降低下点击频率（50%）
                            clickCount++;
                            if( clickCount % 2 == 0 )
                            {
                                infoNode.style.backgroundColor = "";
                            }
                            else
                            {
                                infoNode.style.backgroundColor = "#666666";
                            }
                            btn.click();
                            showStatus('已经累计自动点击了 '+clickCount+' 次');
                            //console.log('真正点击');
                        }else{
                            //console.log('跳过的点击');
                        }
                        clicked = true;
                    }
                }
            }

        }else if (clickCount ===0){
            showStatus();
        }
    } catch(ex) {
        console.log(ex);
    }
    if(clicked){
        currentBtnClickTimes++;
    }else{
        currentBtnClickTimes = 0;
    }
    running = false;

}

(function() {
    'use strict';
    if (location.host === "www.sandbox.game") {
        showStatus();
        setInterval(()=>{
            run()
        },
        100);
    }

})();
